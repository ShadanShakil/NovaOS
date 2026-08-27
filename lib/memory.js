/**
 * Pure memory allocation and partition management algorithms
 */

export function runFirstFit(blocks, size) {
  return blocks.findIndex((b) => !b.allocated && b.size >= size);
}

export function runBestFit(blocks, size) {
  let minSize = Infinity;
  let targetIdx = -1;
  blocks.forEach((b, idx) => {
    if (!b.allocated && b.size >= size && b.size < minSize) {
      minSize = b.size;
      targetIdx = idx;
    }
  });
  return targetIdx;
}

export function runWorstFit(blocks, size) {
  let maxSize = -1;
  let targetIdx = -1;
  blocks.forEach((b, idx) => {
    if (!b.allocated && b.size >= size && b.size > maxSize) {
      maxSize = b.size;
      targetIdx = idx;
    }
  });
  return targetIdx;
}

export function allocateMemory(blocks, size, algo) {
  let targetIdx = -1;
  if (algo === 'firstFit') {
    targetIdx = runFirstFit(blocks, size);
  } else if (algo === 'bestFit') {
    targetIdx = runBestFit(blocks, size);
  } else if (algo === 'worstFit') {
    targetIdx = runWorstFit(blocks, size);
  }

  if (targetIdx === -1) {
    return {
      success: false,
      blocks,
      error: `[ERROR] Out of Memory! Cannot fit ${size}MB process.`
    };
  }

  const updated = [...blocks];
  const block = updated[targetIdx];
  const processName = `App-${size}MB`;

  if (block.size > size) {
    // Split block: allocated block + remainder free block
    const allocatedBlock = {
      id: block.id,
      size: size,
      allocated: true,
      process: processName,
    };
    
    const maxId = Math.max(...blocks.map((b) => b.id), 0);
    const freeBlock = {
      id: maxId + 1,
      size: block.size - size,
      allocated: false,
      process: null,
    };

    updated.splice(targetIdx, 1, allocatedBlock, freeBlock);
  } else {
    // Exact size match, no split
    updated[targetIdx] = {
      ...block,
      allocated: true,
      process: processName,
    };
  }

  return {
    success: true,
    blocks: updated,
    message: `[SUCCESS] Allocated ${size}MB to Block #${block.id} (${algo})`
  };
}

export function freeMemoryBlock(blocks, blockId) {
  let updated = blocks.map((b) =>
    b.id === blockId ? { ...b, allocated: false, process: null } : b
  );

  // Coalesce adjacent free blocks
  const coalesced = [];
  for (let i = 0; i < updated.length; i++) {
    const current = updated[i];
    if (
      coalesced.length > 0 &&
      !coalesced[coalesced.length - 1].allocated &&
      !current.allocated
    ) {
      // Merge current free block into previous free block
      coalesced[coalesced.length - 1].size += current.size;
    } else {
      coalesced.push({ ...current });
    }
  }

  return coalesced;
}
