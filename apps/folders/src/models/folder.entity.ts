import { baseScopes } from 'apps/common/src/base/base-scopes';
import { File } from 'apps/files/src/models';
import { User } from 'apps/users/src/models';
import { Op } from 'sequelize';
import {
  Table,
  Column,
  Model,
  Scopes,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

@Scopes(() => ({
  ...baseScopes,
  byName: (name: string) => ({ where: { name } }),
  byParentId: (parentId: number) => ({ where: { parentId } }),
  parentIdIsNull: () => ({ where: { parentId: { [Op.is]: null } } }),
  withUser: () => ({
    include: [
      {
        model: User,
        as: 'user',
        required: true,
      },
    ],
  }),
  withFiles: () => ({
    include: [
      {
        model: File.scope(['notDeleted']),
        as: 'files',
        required: false,
      },
    ],
  }),
}))
@Table({
  tableName: 'folders',
  timestamps: true,
  underscored: false,
  paranoid: true,
})
export class Folder extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @ForeignKey(() => Folder)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPublic: boolean;

  @BelongsTo(() => User, 'userId')
  user: User;

  files: File[];
  folders: Folder[];
}
