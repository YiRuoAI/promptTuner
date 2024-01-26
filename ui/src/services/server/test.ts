import { getIntl, request } from '@umijs/max';

export async function create(req: ServerAPI.createTestReq) {
  return request<{ data: string }>('/test/create', {
    method: 'POST',
    data: req,
  });
}

export async function update(req: ServerAPI.updateTestReq) {
  return request<{ data: string }>('/test/update', {
    method: 'POST',
    data: req,
  });
}

export async function del(id: string) {
  return request<{ data: string }>('/test/delete', {
    method: 'DELETE',
    params: { id },
  });
}

export async function list(req: ServerAPI.listTestReq): Promise<{ data: { list: ServerAPI.TestListItem[], total: number } }> {
  return request('/test/list', {
    method: 'GET',
    params: {
      page: req.current,
      pageSize: req.pageSize,
    },
  });
}

export async function detail(id: string): Promise<{ data: ServerAPI.TestListItem }> {
  return request('/test/detail', {
    method: 'GET',
    params: { id },
  });
}

export async function startJob(testId: string): Promise<{ data: number }> {
  return request('/test/start-job', {
    method: 'POST',
    data: { testId },
  });
}

export async function listJob(req: ServerAPI.listTestJobReq): Promise<{ data: { list: ServerAPI.TestJobListItem[], total: number } }> {
  return request('/test/list-test-job', {
    method: 'GET',
    params: {
      page: req.current,
      pageSize: req.pageSize,
    },
  });
}

export async function getTestJobDetail(req: ServerAPI.TestJobDetailReq): Promise<{ data: ServerAPI.TestJobDetail }> {
  return request('/test/test-job-detail', {
    method: 'GET',
    params: req,
  });
}