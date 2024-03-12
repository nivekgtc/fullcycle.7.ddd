import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import CostumerModel from '../../../costumer/repository/sequelize/costumer.model'
import OrderItemModel from './order-item.model'

@Table({
  tableName: 'orders',
  timestamps: false
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column
  declare id: string

  @ForeignKey(() => CostumerModel)
  @Column({
    allowNull: false
  })
  declare costumer_id: string

  @BelongsTo(() => CostumerModel)
  declare costumer: CostumerModel

  @HasMany(() => OrderItemModel)
  declare items: OrderItemModel[]

  @Column({ allowNull: false })
  declare total: number
}
