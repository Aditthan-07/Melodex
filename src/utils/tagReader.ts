/**
 * Zero-dependency fast client-side audio metadata and album art parser.
 * Supports ID3v2 (MP3), ID3v1, and native FLAC picture/comment blocks.
 */

export interface ParsedAudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  coverUrl?: string;
}

const decodeText = (bytes: Uint8Array, encoding: number): string => {
  try {
    if (encoding === 0 || encoding === 3) {
      // 0 = ISO-8859-1 (Latin1), 3 = UTF-8
      const decoder = new TextDecoder(encoding === 3 ? 'utf-8' : 'iso-8859-1');
      return decoder.decode(bytes).replace(/\0+$/, '').trim();
    } else if (encoding === 1 || encoding === 2) {
      // 1 = UTF-16 with BOM, 2 = UTF-16BE
      const decoder = new TextDecoder(encoding === 2 ? 'utf-16be' : 'utf-16');
      return decoder.decode(bytes).replace(/\0+$/, '').trim();
    }
  } catch (err) {
    console.debug('Failed to decode ID3 text frame:', err);
  }
  return '';
};

const parseID3v2 = (view: DataView, bytes: Uint8Array): ParsedAudioMetadata => {
  const result: ParsedAudioMetadata = {};
  const version = bytes[3];
  const tagSize = ((bytes[6] & 0x7f) << 21) |
                  ((bytes[7] & 0x7f) << 14) |
                  ((bytes[8] & 0x7f) << 7) |
                  (bytes[9] & 0x7f);

  let offset = 10;
  const maxOffset = Math.min(bytes.length, 10 + tagSize);

  while (offset + 10 < maxOffset) {
    // Check for padding (zero bytes)
    if (bytes[offset] === 0) break;

    const frameId = String.fromCharCode(
      bytes[offset],
      bytes[offset + 1],
      bytes[offset + 2],
      bytes[offset + 3]
    );

    const frameSize = version === 4
      ? ((bytes[offset + 4] & 0x7f) << 21) |
        ((bytes[offset + 5] & 0x7f) << 14) |
        ((bytes[offset + 6] & 0x7f) << 7) |
        (bytes[offset + 7] & 0x7f)
      : view.getUint32(offset + 4, false);

    if (frameSize <= 0 || offset + 10 + frameSize > bytes.length) break;

    const frameDataOffset = offset + 10;
    const frameBytes = bytes.subarray(frameDataOffset, frameDataOffset + frameSize);

    if (frameId === 'TIT2' && !result.title) {
      const enc = frameBytes[0];
      result.title = decodeText(frameBytes.subarray(1), enc);
    } else if (frameId === 'TPE1' && !result.artist) {
      const enc = frameBytes[0];
      result.artist = decodeText(frameBytes.subarray(1), enc);
    } else if (frameId === 'TALB' && !result.album) {
      const enc = frameBytes[0];
      result.album = decodeText(frameBytes.subarray(1), enc);
    } else if (frameId === 'APIC' && !result.coverUrl) {
      try {
        const enc = frameBytes[0];
        let p = 1;
        // Read null-terminated MIME type string
        let mimeType = '';
        while (p < frameBytes.length && frameBytes[p] !== 0) {
          mimeType += String.fromCharCode(frameBytes[p]);
          p++;
        }
        p++; // skip null terminator

        // Picture type (e.g. 3 = Cover Front)
        p++; // skip picture type

        // Skip description (null-terminated according to encoding)
        if (enc === 1 || enc === 2) {
          while (p + 1 < frameBytes.length && !(frameBytes[p] === 0 && frameBytes[p + 1] === 0)) {
            p += 2;
          }
          p += 2;
        } else {
          while (p < frameBytes.length && frameBytes[p] !== 0) {
            p++;
          }
          p++;
        }

        if (p < frameBytes.length) {
          const imgBytes = frameBytes.subarray(p);
          const finalMime = mimeType.trim() || 'image/jpeg';
          const blob = new Blob([imgBytes as unknown as BlobPart], { type: finalMime });
          result.coverUrl = URL.createObjectURL(blob);
        }
      } catch (err) {
        console.debug('Failed to parse APIC frame:', err);
      }
    }

    offset += 10 + frameSize;
  }

  return result;
};

const parseFLAC = (view: DataView, bytes: Uint8Array): ParsedAudioMetadata => {
  const result: ParsedAudioMetadata = {};
  let offset = 4; // Skip 'fLaC'

  while (offset + 4 < bytes.length) {
    const header = view.getUint32(offset, false);
    const isLast = (header & 0x80000000) !== 0;
    const blockType = (header >> 24) & 0x7f;
    const blockSize = header & 0x00ffffff;
    offset += 4;

    if (offset + blockSize > bytes.length) break;

    // Block 6 = PICTURE
    if (blockType === 6 && !result.coverUrl) {
      try {
        let p = offset;
        p += 4; // picture type
        const mimeLen = view.getUint32(p, false);
        p += 4;
        let mime = '';
        for (let i = 0; i < mimeLen; i++) {
          mime += String.fromCharCode(bytes[p + i]);
        }
        p += mimeLen;
        const descLen = view.getUint32(p, false);
        p += 4 + descLen; // skip description
        p += 16; // skip width(4), height(4), depth(4), colors(4)
        const dataLen = view.getUint32(p, false);
        p += 4;
        if (p + dataLen <= bytes.length) {
          const imgBytes = bytes.subarray(p, p + dataLen);
          const blob = new Blob([imgBytes as unknown as BlobPart], { type: mime || 'image/jpeg' });
          result.coverUrl = URL.createObjectURL(blob);
        }
      } catch (e) {
        console.debug('Failed to parse FLAC picture block:', e);
      }
    }

    // Block 4 = VORBIS_COMMENT
    if (blockType === 4) {
      try {
        let p = offset;
        const vendorLen = view.getUint32(p, true);
        p += 4 + vendorLen;
        const numComments = view.getUint32(p, true);
        p += 4;
        const decoder = new TextDecoder('utf-8');
        for (let i = 0; i < numComments && p + 4 < offset + blockSize; i++) {
          const commentLen = view.getUint32(p, true);
          p += 4;
          if (p + commentLen <= offset + blockSize) {
            const commentStr = decoder.decode(bytes.subarray(p, p + commentLen));
            const eqIdx = commentStr.indexOf('=');
            if (eqIdx !== -1) {
              const key = commentStr.substring(0, eqIdx).toUpperCase();
              const val = commentStr.substring(eqIdx + 1);
              if (key === 'TITLE' && !result.title) result.title = val;
              if (key === 'ARTIST' && !result.artist) result.artist = val;
              if (key === 'ALBUM' && !result.album) result.album = val;
            }
          }
          p += commentLen;
        }
      } catch (e) {
        console.debug('Failed to parse FLAC vorbis comments:', e);
      }
    }

    if (isLast) break;
    offset += blockSize;
  }

  return result;
};

export async function extractAudioMetadata(file: File): Promise<ParsedAudioMetadata> {
  try {
    // Read up to first 512KB for headers, tags, and album art
    const sliceSize = Math.min(file.size, 512 * 1024);
    const buffer = await file.slice(0, sliceSize).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const view = new DataView(buffer);

    // Check ID3v2 header
    if (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) {
      // 'ID3'
      return parseID3v2(view, bytes);
    }

    // Check FLAC header 'fLaC'
    if (bytes[0] === 0x66 && bytes[1] === 0x4c && bytes[2] === 0x61 && bytes[3] === 0x43) {
      return parseFLAC(view, bytes);
    }

    // Fallback: check ID3v1 at end of file (128 bytes)
    if (file.size >= 128) {
      const v1Buffer = await file.slice(file.size - 128).arrayBuffer();
      const v1Bytes = new Uint8Array(v1Buffer);
      if (v1Bytes[0] === 0x54 && v1Bytes[1] === 0x41 && v1Bytes[2] === 0x47) {
        // 'TAG'
        const latin1 = new TextDecoder('iso-8859-1');
        const title = latin1.decode(v1Bytes.subarray(3, 33)).replace(/\0+$/, '').trim();
        const artist = latin1.decode(v1Bytes.subarray(33, 63)).replace(/\0+$/, '').trim();
        const album = latin1.decode(v1Bytes.subarray(63, 93)).replace(/\0+$/, '').trim();
        return {
          title: title || undefined,
          artist: artist || undefined,
          album: album || undefined,
        };
      }
    }
  } catch (err) {
    console.debug('Error reading metadata for audio file:', err);
  }

  return {};
}
