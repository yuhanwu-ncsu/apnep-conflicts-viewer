import type { StackItem } from '../../../config'

export class UndoRedoManager {
  private stackItems: StackItem[] = []
  private forwardStackItems: StackItem[] = []
  private initialMoment: StackItem[] = []

  /**
   * Clone instance of UndoRedoManager with deep copy of internal arrays
   * @returns A deep clone of the current UndoRedoManager instance
   */
  clone (): UndoRedoManager {
    const newManager = new UndoRedoManager()

    // Deep clone arrays and their objects to avoid shared references
    ;(newManager as any).stackItems = this.stackItems.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      layerIds: item.layerIds ? [...item.layerIds] : undefined
    }))
    ;(newManager as any).forwardStackItems = this.forwardStackItems.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      layerIds: item.layerIds ? [...item.layerIds] : undefined
    }))
    ;(newManager as any).initialMoment = this.initialMoment.map(item => ({
      ...item,
      timestamp: new Date(item.timestamp),
      layerIds: item.layerIds ? [...item.layerIds] : undefined
    }))

    return newManager
  }

  /**
   * Initialize the undo-redo manager with a starting moment
   * @param moment The initial moment to add to the stack
   * @param serviceUrl The service URL associated with the moment
   */
  initialize (moment: number | string, serviceUrl: string): void {
    if ((moment !== undefined && moment !== null) && serviceUrl) {
      this.initialMoment.push({
        moment,
        timestamp: new Date(),
        serviceUrl
      })
    }
  }

  /**
   * Check if the undo-redo manager has been initialized
   * @returns True if initialized, false otherwise
   */
  isInitialized (): boolean {
    return this.initialMoment.length > 0
  }

  /**
   * Add a new moment to the undo-redo stack
   * @param moment The moment to add
   * @param serviceUrl Optional service URL associated with the moment
   * @param layerIds Optional array of layer IDs that were affected by this edit
   * @returns The new size of the stack
   */
  add (moment: number | string, serviceUrl: string, layerIds?: number[]): number {
    const stackItem: StackItem = {
      moment,
      timestamp: new Date(),
      serviceUrl,
      layerIds
    }
    return this.stackItems.push(stackItem)
  }

  /**
   * Undo the most recent action
   * @returns The stack item that was undone, or undefined if undo is not possible
   */
  undo (): StackItem | undefined {
    if (!this.canUndo()) {
      return undefined
    }

    const poppedItem = this.stackItems.pop()
    if (poppedItem) {
      this.forwardStackItems.push(poppedItem)
    }
    return poppedItem
  }

  /**
   * Redo the most recently undone action
   * @returns The stack item that was redone, or undefined if redo is not possible
   */
  redo (): StackItem | undefined {
    if (!this.canRedo()) {
      return undefined
    }

    const forwardEdit = this.forwardStackItems.pop()
    if (forwardEdit) {
      this.stackItems.push(forwardEdit)
    }
    return forwardEdit
  }

  /**
   * Peek at the most recent stack item without removing it
   * @returns The most recent stack item, or undefined if the stack is empty
   */
  peek (): StackItem | undefined {
    return this.stackItems.at(-1)
  }

  /**
   * Check if an undo operation is possible
   * @returns True if undo is possible, false otherwise
   */
  canUndo (): boolean {
    return this.stackItems.length > 0
  }

  /**
   * Check if a redo operation is possible
   * @returns True if redo is possible, false otherwise
   */
  canRedo (): boolean {
    return this.hasForwardEdits()
  }

  /**
   * Clear the undo-redo stack
   */
  clear (): void {
    this.stackItems = []
    this.forwardStackItems = []
    this.initialMoment = []
  }

  /**
   * Get the total size of the undo-redo stack
   * @returns The total number of stack items
   */
  size (): number {
    return this.stackItems.length + this.forwardStackItems.length
  }

  /**
   * Check if there are any forward edits available for redo
   * @returns True if there are forward edits, false otherwise
   */
  hasForwardEdits (): boolean {
    return this.forwardStackItems.length > 0
  }

  /**
   * Clear all forward moments available for redo
   */
  clearForwardMoments (): void {
    this.forwardStackItems = []
  }

  /**
   * Gets the most recent item in the stack that matches the provided URL
   * @param url URL of the item to search for
   * @returns Returns the most recent instance in the stack for the given service.
   * If no instance exists in the stack, returns the initial moment for that service.
   */
  getServiceCurrentMoment (url: string): StackItem | undefined {
    // Find last item by iterating backwards
    for (let i = this.stackItems.length - 1; i >= 0; i--) {
      if (this.stackItems[i].serviceUrl === url) {
        return this.stackItems[i]
      }
    }

    return this.initialMoment.find(item => item.serviceUrl === url)
  }

  /**
   * Get the initial moments
   * @returns Array of initial stack items
   */
  initialMoments (): StackItem[] {
    return this.initialMoment
  }
}
