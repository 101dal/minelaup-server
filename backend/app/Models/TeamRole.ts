import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Permission from './Permission'

export default class TeamRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ serializeAs: null })
  public permissionId: number

  @belongsTo(() => Permission)
  public permission: BelongsTo<typeof Permission>

  @column()
  public teamId: number
}
