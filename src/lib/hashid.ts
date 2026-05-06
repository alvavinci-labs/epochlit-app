import { randomBytes } from 'crypto'

// 12桁の英数字ハッシュIDを生成する
export function generateHashId(): string {
  return randomBytes(6).toString('hex') // 6bytes = 12桁hex
}
