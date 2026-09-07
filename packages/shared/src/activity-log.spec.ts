import { describe, expect, it } from 'vitest';

import { ActivityLog } from './activity-log';

const at = (iso: string) => new Date(iso);

describe('ActivityLog', () => {
  it('REQ-001: records an entry and makes it available to subsequent queries', () => {
    const log = new ActivityLog();
    const now = at('2026-09-07T08:00:00.000Z');

    log.record(
      {
        actor: 'alice',
        action: 'signed-in',
        metadata: { ipAddress: '127.0.0.1' },
      },
      { now },
    );

    expect(log.queryByActor('alice')).toEqual([
      {
        actor: 'alice',
        action: 'signed-in',
        timestamp: now,
        metadata: { ipAddress: '127.0.0.1' },
      },
    ]);
  });

  it('REQ-002: rejects an entry with an empty actor and records nothing', () => {
    const log = new ActivityLog();
    const now = at('2026-09-07T08:01:00.000Z');

    expect(() =>
      log.record(
        {
          actor: '',
          action: 'signed-in',
        },
        { now },
      ),
    ).toThrowError('actor and action are required');

    expect(log.queryByActor('alice')).toEqual([]);
  });

  it('REQ-002: rejects an entry with an absent action and records nothing', () => {
    const log = new ActivityLog();
    const now = at('2026-09-07T08:02:00.000Z');

    expect(() =>
      log.record(
        {
          actor: 'alice',
          action: undefined,
        },
        { now },
      ),
    ).toThrowError('actor and action are required');

    expect(log.queryByActor('alice')).toEqual([]);
  });

  it('REQ-003: returns entries for an actor most recent first', () => {
    const log = new ActivityLog();

    log.record(
      { actor: 'alice', action: 'created-quiz' },
      { now: at('2026-09-07T08:00:00.000Z') },
    );
    log.record(
      { actor: 'alice', action: 'joined-session' },
      { now: at('2026-09-07T08:05:00.000Z') },
    );
    log.record(
      { actor: 'bob', action: 'signed-in' },
      { now: at('2026-09-07T08:06:00.000Z') },
    );

    expect(log.queryByActor('alice').map((entry) => entry.action)).toEqual([
      'joined-session',
      'created-quiz',
    ]);
  });

  it('REQ-003: breaks same-timestamp ties by reverse insertion order and keeps repeated queries stable', () => {
    const log = new ActivityLog();
    const sameInstant = at('2026-09-07T08:10:00.000Z');

    log.record({ actor: 'alice', action: 'first' }, { now: sameInstant });
    log.record({ actor: 'alice', action: 'second' }, { now: sameInstant });

    const firstQuery = log.queryByActor('alice').map((entry) => entry.action);
    const secondQuery = log.queryByActor('alice').map((entry) => entry.action);

    expect(firstQuery).toEqual(['second', 'first']);
    expect(secondQuery).toEqual(['second', 'first']);
  });

  it('REQ-004: stores sensitive metadata values as an irreversible redacted placeholder', () => {
    const log = new ActivityLog();

    log.record(
      {
        actor: 'alice',
        action: 'signed-in',
        metadata: {
          password: 'super-secret',
          note: 'keep this',
        },
      },
      { now: at('2026-09-07T08:15:00.000Z') },
    );

    expect(log.queryByActor('alice')[0]?.metadata).toEqual({
      password: '[REDACTED]',
      note: 'keep this',
    });
  });

  it('REQ-004: redacts nested mixed-case sensitive keys while preserving non-sensitive keys as-is', () => {
    const log = new ActivityLog();

    log.record(
      {
        actor: 'alice',
        action: 'updated-profile',
        metadata: {
          profile: {
            passWord: 'abc123',
            displayName: 'Alice',
          },
          ApiKey: 'key-1',
          tokenCount: 3,
        },
      },
      { now: at('2026-09-07T08:16:00.000Z') },
    );

    expect(log.queryByActor('alice')[0]?.metadata).toEqual({
      profile: {
        passWord: '[REDACTED]',
        displayName: 'Alice',
      },
      ApiKey: '[REDACTED]',
      tokenCount: 3,
    });
  });

  it('REQ-005: returns every entry whose timestamp falls within the supplied time range', () => {
    const log = new ActivityLog();

    log.record(
      { actor: 'alice', action: 'before-range' },
      { now: at('2026-09-07T07:59:00.000Z') },
    );
    log.record(
      { actor: 'alice', action: 'inside-range' },
      { now: at('2026-09-07T08:00:30.000Z') },
    );
    log.record(
      { actor: 'alice', action: 'after-range' },
      { now: at('2026-09-07T08:02:00.000Z') },
    );

    expect(
      log
        .queryByTimeRange(
          at('2026-09-07T08:00:00.000Z'),
          at('2026-09-07T08:01:00.000Z'),
        )
        .map((entry) => entry.action),
    ).toEqual(['inside-range']);
  });

  it('REQ-005: includes entries exactly at the start and end instants of the range', () => {
    const log = new ActivityLog();
    const start = at('2026-09-07T08:20:00.000Z');
    const end = at('2026-09-07T08:21:00.000Z');

    log.record({ actor: 'alice', action: 'at-start' }, { now: start });
    log.record(
      { actor: 'alice', action: 'between' },
      { now: at('2026-09-07T08:20:30.000Z') },
    );
    log.record({ actor: 'alice', action: 'at-end' }, { now: end });

    expect(log.queryByTimeRange(start, end).map((entry) => entry.action)).toEqual([
      'at-end',
      'between',
      'at-start',
    ]);
  });

  it('REQ-006: returns an empty array when a time-range query matches no activity', () => {
    const log = new ActivityLog();

    log.record(
      { actor: 'alice', action: 'signed-in' },
      { now: at('2026-09-07T08:25:00.000Z') },
    );

    expect(
      log.queryByTimeRange(
        at('2026-09-07T09:00:00.000Z'),
        at('2026-09-07T09:05:00.000Z'),
      ),
    ).toEqual([]);
  });

  it('REQ-006: returns an empty array for an unknown actor with no way to distinguish why there were no matches', () => {
    const log = new ActivityLog();

    log.record(
      { actor: 'alice', action: 'signed-in' },
      { now: at('2026-09-07T08:26:00.000Z') },
    );

    expect(log.queryByActor('charlie')).toEqual([]);
  });

  it('REQ-007: uses caller-supplied time as the stored timestamp', () => {
    const log = new ActivityLog();
    const injectedNow = at('2026-09-07T08:30:00.000Z');

    log.record(
      { actor: 'alice', action: 'signed-in' },
      { now: injectedNow },
    );

    expect(log.queryByActor('alice')[0]?.timestamp).toEqual(injectedNow);
  });

  it('REQ-007: produces deterministic results when the same injected time is reused', () => {
    const firstLog = new ActivityLog();
    const secondLog = new ActivityLog();
    const injectedNow = at('2026-09-07T08:31:00.000Z');

    firstLog.record(
      { actor: 'alice', action: 'signed-in', metadata: { note: 'same' } },
      { now: injectedNow },
    );
    secondLog.record(
      { actor: 'alice', action: 'signed-in', metadata: { note: 'same' } },
      { now: injectedNow },
    );

    expect(firstLog.queryByActor('alice')).toEqual(secondLog.queryByActor('alice'));
  });
});
