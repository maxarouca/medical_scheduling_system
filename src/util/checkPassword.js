import bcrytpt from 'bcryptjs'

export default function checkPassword(password, password_hash) {
  return bcrytpt.compare(password, password_hash)
}
