import { baseScopes } from 'apps/common/src/base/base-scopes';
import { Table, Column, Model, Scopes, DataType } from 'sequelize-typescript';

@Scopes(() => ({
  ...baseScopes,
  byEmail: (email: string) => ({ where: { email } }),
}))
@Table({
  tableName: 'users',
  timestamps: true,
  underscored: false,
  paranoid: true,
})
export class User extends Model {
  @Column({
    type: DataType.STRING(129),
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;
}
