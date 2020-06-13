import { BaseCommand, Kernel } from '@adonisjs/ace'
import { inject } from '@adonisjs/fold'
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import User from 'App/Models/User'
import { schema, validator, rules } from '@ioc:Adonis/Core/Validator'

@inject([null, null, 'Adonis/Lucid/Database'])
export default class Install extends BaseCommand {
  public static commandName = 'install'
  public static description = 'Install all the necessary for the project.'

  constructor (app: ApplicationContract, kernel: Kernel, private db: DatabaseContract) {
    super(app, kernel)
  }

  public static settings = {
    loadApp: true,
  }

  public async handle () {
    try {
      const adminExist = await User.query().where('role', 3).first()

      if (adminExist) {
        this.logger.error(`There is already an admin user named ${this.colors.cyan(adminExist.username)}.`)
        const override = await this.prompt.confirm('Do you want to override it ?')

        if (!override) {
          process.exit(0)
        }

        await adminExist.delete()
      }

      const username = await this.prompt.ask('Admin name')
      const password = await this.prompt.secure('Admin password')
      const email = await this.prompt.ask('Admin email')

      const user = await User.create({
        username: username,
        password: password,
        email: email,
        role: 3,
      })

      this.logger.complete(`The admin user named ${user.username} have been create. Enjoy ! 😊`)
      process.exit(0)
    } catch(error) {
      throw error
    }
  }
}
