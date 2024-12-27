import { Op } from 'sequelize';

export const baseScopes: { [key: string]: any } = {
  byId: (id: number) => ({ where: { id } }),
  byUserId: (userId: number) => ({ where: { userId } }),
  pagination: (query) => ({ limit: query.limit, offset: query.offset }),
  orderBy: (arrayOfOrders: [[string, string]]) => ({ order: arrayOfOrders }),
  subQuery: (isEnabled: boolean) => ({ subQuery: isEnabled }),
  groupBy: (field: string) => ({ group: [field] }),
  limit: (limit: number) => ({ limit }),
  notDeleted: () => ({ where: { deletedAt: { [Op.is]: null } } }),
};
