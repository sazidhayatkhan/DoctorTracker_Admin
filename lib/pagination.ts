/** Up to `size` page numbers centred on the current page */
export const getPageWindow = (page: number, totalPages: number, size = 5) => {
  const count = Math.min(size, totalPages)
  const start = Math.min(
    Math.max(1, page - Math.floor(count / 2)),
    totalPages - count + 1
  )
  return Array.from({ length: count }, (_, i) => start + i)
}
