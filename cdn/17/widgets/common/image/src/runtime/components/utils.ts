import type { DataRecord } from "jimu-core"

export const isSameRecord = (record1: DataRecord, record2: DataRecord): boolean => {
  const sameRecordId = record1?.getId() === record2?.getId()
  const sameDsId = record1?.dataSource.id === record2?.dataSource.id
  if (sameRecordId && sameDsId) {
    return true
  }
  return false
}