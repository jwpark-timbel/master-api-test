'use strict';

const request = require('supertest');
const app = require('../app');

describe('GET /health', () => {
  it('HTTP 상태 코드 200을 반환해야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('status 필드가 "ok" 이어야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });

  it('uptime 필드가 존재해야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('uptime');
    expect(typeof res.body.uptime).toBe('number');
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
  });

  it('response_time_ms 필드가 존재해야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('response_time_ms');
  });

  it('response_time_ms는 밀리초 단위의 숫자값이어야 한다', async () => {
    const res = await request(app).get('/health');
    expect(typeof res.body.response_time_ms).toBe('number');
    expect(res.body.response_time_ms).toBeGreaterThanOrEqual(0);
  });

  it('기존 필드(status, uptime)가 그대로 유지되어야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('uptime');
    expect(res.body).toHaveProperty('response_time_ms');
  });

  it('Content-Type이 application/json 이어야 한다', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['content-type']).toMatch(/application\/json/);
  });

  it('복수 요청에서도 매번 유효한 응답을 반환해야 한다 (회귀 검증)', async () => {
    for (let i = 0; i < 3; i++) {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.response_time_ms).toBe('number');
      expect(res.body.response_time_ms).toBeGreaterThanOrEqual(0);
    }
  });
});
