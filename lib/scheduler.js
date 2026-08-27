// First-Come, First-Served (FCFS)
export function runFCFS(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let currentTime = 0;
  const schedule = [];
  const completed = [];

  for (const proc of sorted) {
    if (currentTime < proc.arrivalTime) {
      currentTime = proc.arrivalTime;
    }
    const start = currentTime;
    const end = start + proc.burstTime;
    currentTime = end;

    schedule.push({
      id: proc.id,
      name: proc.name,
      start,
      end,
      duration: proc.burstTime,
    });

    completed.push({
      ...proc,
      startTime: start,
      completionTime: end,
      turnaroundTime: end - proc.arrivalTime,
      waitingTime: (end - proc.arrivalTime) - proc.burstTime,
    });
  }

  return { schedule, processes: completed };
}

// Shortest Job First (SJF Non-Preemptive)
export function runSJF(processes) {
  let remaining = [...processes];
  let currentTime = 0;
  const schedule = [];
  const completed = [];

  while (remaining.length > 0) {
    const arrived = remaining.filter((p) => p.arrivalTime <= currentTime);
    
    if (arrived.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Sort by burstTime. Tie-breaker: arrivalTime
    arrived.sort((a, b) => {
      if (a.burstTime !== b.burstTime) {
        return a.burstTime - b.burstTime;
      }
      return a.arrivalTime - b.arrivalTime;
    });

    const nextProc = arrived[0];
    remaining = remaining.filter((p) => p.id !== nextProc.id);

    const start = currentTime;
    const end = start + nextProc.burstTime;
    currentTime = end;

    schedule.push({
      id: nextProc.id,
      name: nextProc.name,
      start,
      end,
      duration: nextProc.burstTime,
    });

    completed.push({
      ...nextProc,
      startTime: start,
      completionTime: end,
      turnaroundTime: end - nextProc.arrivalTime,
      waitingTime: (end - nextProc.arrivalTime) - nextProc.burstTime,
    });
  }

  return { schedule, processes: completed };
}

// Priority Scheduling (Non-Preemptive, lower number = higher priority)
export function runPriority(processes) {
  let remaining = [...processes];
  let currentTime = 0;
  const schedule = [];
  const completed = [];

  while (remaining.length > 0) {
    const arrived = remaining.filter((p) => p.arrivalTime <= currentTime);
    
    if (arrived.length === 0) {
      const nextArrival = Math.min(...remaining.map((p) => p.arrivalTime));
      currentTime = nextArrival;
      continue;
    }

    // Sort by priority (ascending). Tie-breaker: arrivalTime
    arrived.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.arrivalTime - b.arrivalTime;
    });

    const nextProc = arrived[0];
    remaining = remaining.filter((p) => p.id !== nextProc.id);

    const start = currentTime;
    const end = start + nextProc.burstTime;
    currentTime = end;

    schedule.push({
      id: nextProc.id,
      name: nextProc.name,
      start,
      end,
      duration: nextProc.burstTime,
    });

    completed.push({
      ...nextProc,
      startTime: start,
      completionTime: end,
      turnaroundTime: end - nextProc.arrivalTime,
      waitingTime: (end - nextProc.arrivalTime) - nextProc.burstTime,
    });
  }

  return { schedule, processes: completed };
}

// Round Robin (Preemptive)
export function runRoundRobin(processes, timeQuantum = 2) {
  const quantum = Number(timeQuantum) || 2;
  let currentTime = 0;
  const schedule = [];
  const completed = [];

  const remainingBurst = {};
  const processMap = {};
  processes.forEach((p) => {
    remainingBurst[p.id] = p.burstTime;
    processMap[p.id] = { ...p };
  });

  const queue = [];
  const addedToReady = new Set();

  const addArrivedToQueue = (time) => {
    const arrived = processes.filter(
      (p) => p.arrivalTime <= time && remainingBurst[p.id] > 0 && !addedToReady.has(p.id)
    );
    arrived.sort((a, b) => a.arrivalTime - b.arrivalTime);
    arrived.forEach((p) => {
      queue.push(p.id);
      addedToReady.add(p.id);
    });
  };

  let remainingCount = processes.length;

  while (remainingCount > 0) {
    addArrivedToQueue(currentTime);

    if (queue.length === 0) {
      const unfinished = processes.filter((p) => remainingBurst[p.id] > 0);
      if (unfinished.length > 0) {
        const nextArrival = Math.min(...unfinished.map((p) => p.arrivalTime));
        currentTime = nextArrival;
        addArrivedToQueue(currentTime);
      } else {
        break;
      }
    }

    const pid = queue.shift();
    const proc = processMap[pid];
    const rem = remainingBurst[pid];
    const execTime = Math.min(rem, quantum);

    const start = currentTime;
    const end = start + execTime;
    currentTime = end;
    remainingBurst[pid] -= execTime;

    schedule.push({
      id: proc.id,
      name: proc.name,
      start,
      end,
      duration: execTime,
    });

    addArrivedToQueue(currentTime);

    if (remainingBurst[pid] > 0) {
      queue.push(pid);
    } else {
      remainingCount--;
      
      const firstSegment = schedule.find((s) => s.id === pid);
      const firstStart = firstSegment ? firstSegment.start : start;

      completed.push({
        ...proc,
        startTime: firstStart,
        completionTime: end,
        turnaroundTime: end - proc.arrivalTime,
        waitingTime: (end - proc.arrivalTime) - proc.burstTime,
      });
    }
  }

  return { schedule, processes: completed };
}