// NEGÓCIO - entidade local

import type Address from './address'

// PERSISTENCIA - entidade do ORM
// Complexidade de negócio
// Domain
// - Entity
//     - costumer.ts (regra de negócio)

// Complexidade acidental
// infra - Mundo externo
//     - Entity / Model
//     - - cstumer.ts (get, set)

export default class Costumer {
  private readonly _id: string
  private _name: string = ''
  private _address!: Address
  private _active: boolean = false
  private _rewardPoints: number = 0

  constructor (id: string, name: string) {
    this._id = id
    this._name = name
    this.validate()
  }

  validate () {
    if (this._name.length === 0) {
      throw new Error('Name is required')
    }

    if (this._id.length === 0) {
      throw new Error('Id is required')
    }
  }

  isActive (): boolean {
    return this._active
  }

  get id (): string {
    return this._id
  }

  get name (): string {
    return this._name
  }

  get rewardPoints (): number {
    return this._rewardPoints
  }

  changeName (name: string) {
    this._name = name
    this.validate()
  }

  activate (): void {
    if (this._address === undefined) { throw new Error('Address is mandatory to activate a costumer') }
    this._active = true
  }

  deactivate (): void {
    this._active = false
  }

  addRewardPoints (points: number): void {
    this._rewardPoints += points
  }

  set Address (address: Address) {
    this._address = address
  }
}

// let costumer = new Costumer("123") // ERRADO!
// CONSISTENTES

// let costumer = new Costumer("123", "") //ERRADO
// Uma entidade por padrão sempre deve-se auto-validar-se
