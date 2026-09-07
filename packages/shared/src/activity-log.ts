export type ActivityMetadata = Record<string, unknown>;

export interface ActivityRecordInput {
  actor?: string;
  action?: string;
  metadata?: ActivityMetadata;
}

export interface ActivityEntry {
  actor: string;
  action: string;
  timestamp: Date;
  metadata?: ActivityMetadata;
}

const SENSITIVE_KEY_PATTERN = /^(password|token|secret|apikey|authorization)$/i;
const REDACTED = '[REDACTED]';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  );
}

function redact(value: ActivityMetadata): ActivityMetadata {
  const result: ActivityMetadata = {};
  for (const [key, val] of Object.entries(value)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      result[key] = REDACTED;
    } else if (isPlainObject(val)) {
      result[key] = redact(val as ActivityMetadata);
    } else {
      result[key] = val;
    }
  }
  return result;
}

interface StoredEntry extends ActivityEntry {
  sequence: number;
}

export class ActivityLog {
  private entries: StoredEntry[] = [];
  private sequence = 0;

  record(entry: ActivityRecordInput, opts: { now: Date }): void {
    if (!entry.actor || !entry.action) {
      throw new Error('actor and action are required');
    }

    this.entries.push({
      actor: entry.actor,
      action: entry.action,
      timestamp: opts.now,
      metadata: entry.metadata ? redact(entry.metadata) : undefined,
      sequence: this.sequence++,
    });
  }

  queryByActor(actor: string): ActivityEntry[] {
    return this.sortMostRecentFirst(
      this.entries.filter((entry) => entry.actor === actor),
    );
  }

  queryByTimeRange(start: Date, end: Date): ActivityEntry[] {
    const startMs = start.getTime();
    const endMs = end.getTime();
    return this.sortMostRecentFirst(
      this.entries.filter((entry) => {
        const ts = entry.timestamp.getTime();
        return ts >= startMs && ts <= endMs;
      }),
    );
  }

  private sortMostRecentFirst(entries: StoredEntry[]): ActivityEntry[] {
    return [...entries]
      .sort((a, b) => b.sequence - a.sequence)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map(({ actor, action, timestamp, metadata }) => ({
        actor,
        action,
        timestamp,
        metadata,
      }));
  }
}
