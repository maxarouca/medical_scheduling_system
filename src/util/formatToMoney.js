export default function formatToMoney(number) {
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
