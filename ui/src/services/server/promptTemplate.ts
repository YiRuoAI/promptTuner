import { getIntl, request } from '@umijs/max';

export async function create(req: ServerAPI.createPromptReq) {
  return request<{ data: string }>('/prompt-template/create', {
    method: 'POST',
    data: req,
  });
}

export async function update(req: ServerAPI.updatePromptReq) {
  return request<{ data: string }>('/prompt-template/update', {
    method: 'POST',
    data: req,
  });
}

export async function del(id: string) {
  return request<{ data: string }>('/prompt-template/delete', {
    method: 'DELETE',
    params: { id },
  });
}

export async function list(req: ServerAPI.listPromptReq): Promise<{ data: { list: ServerAPI.PromptListItem[], total: number } }> {
  return request('/prompt-template/list', {
    method: 'GET',
    params: {
      page: req.current,
      pageSize: req.pageSize,
    },
  });
}