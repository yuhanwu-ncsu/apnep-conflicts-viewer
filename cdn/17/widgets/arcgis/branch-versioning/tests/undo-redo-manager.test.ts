import { UndoRedoManager } from '../src/runtime/context/managers/undo-redo-manager'

describe('UndoRedoManager', () => {
  let undoRedoManager: UndoRedoManager

  beforeEach(() => {
    undoRedoManager = new UndoRedoManager()
  })

  describe('initialize', () => {
    it('should initialize with a moment and service URL', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.isInitialized()).toBe(true)
      const initialMoments = undoRedoManager.initialMoments()
      expect(initialMoments).toHaveLength(1)
      expect(initialMoments[0].moment).toBe(12345)
      expect(initialMoments[0].serviceUrl).toBe('https://services.arcgis.com/test/FeatureServer')
      expect(initialMoments[0].timestamp).toBeInstanceOf(Date)
    })

    it('should initialize with a string moment', () => {
      undoRedoManager.initialize('abc123', 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.isInitialized()).toBe(true)
      const initialMoments = undoRedoManager.initialMoments()
      expect(initialMoments[0].moment).toBe('abc123')
    })

    it('should have initial moments after initialization', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.initialize(99999, 'https://services.arcgis.com/other/FeatureServer')

      expect(undoRedoManager.size()).toBe(0)
      expect(undoRedoManager.canUndo()).toBe(false)
      const initialMoments = undoRedoManager.initialMoments()
      expect(initialMoments).toHaveLength(2)
      expect(initialMoments[0].moment).toBe(12345)
      expect(initialMoments[1].moment).toBe(99999)
    })

    it('should handle undefined moment', () => {
      undoRedoManager.initialize(undefined, 'https://services.arcgis.com/test/FeatureServer')

      const initialMoments = undoRedoManager.initialMoments()
      expect(initialMoments).toHaveLength(0)
    })

    it('should handle null moment', () => {
      undoRedoManager.initialize(null, 'https://services.arcgis.com/test/FeatureServer')

      const initialMoments = undoRedoManager.initialMoments()
      expect(initialMoments).toHaveLength(0)
    })
  })

  describe('isInitialized', () => {
    it('should return false when not initialized', () => {
      expect(undoRedoManager.isInitialized()).toBe(false)
    })

    it('should return true after initialization', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.isInitialized()).toBe(true)
    })

    it('should return false after clear is called', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.clear()

      expect(undoRedoManager.isInitialized()).toBe(false)
    })
  })

  describe('add', () => {
    it('should add a moment to the stack', () => {
      const size = undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(size).toBe(1)
      expect(undoRedoManager.size()).toBe(1)
      expect(undoRedoManager.canUndo()).toBe(true)
    })

    it('should add a moment with layer IDs', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer', [1, 2, 3])

      const stackItem = undoRedoManager.peek()
      expect(stackItem.moment).toBe(12345)
      expect(stackItem.layerIds).toEqual([1, 2, 3])
      expect(stackItem.serviceUrl).toBe('https://services.arcgis.com/test/FeatureServer')
      expect(stackItem.timestamp).toBeInstanceOf(Date)
    })

    it('should add multiple moments to the stack', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer')
      const size = undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')

      expect(size).toBe(3)
      expect(undoRedoManager.size()).toBe(3)
    })

    it('should add a string moment to the stack', () => {
      undoRedoManager.add('moment-abc', 'https://services.arcgis.com/test/FeatureServer')

      const stackItem = undoRedoManager.peek()
      expect(stackItem.moment).toBe('moment-abc')
    })

    it('should handle adding moments without layer IDs', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      const stackItem = undoRedoManager.peek()
      expect(stackItem.layerIds).toBeUndefined()
    })
  })

  describe('undo', () => {
    it('should undo the most recent action', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer', [1])
      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer', [2])

      const undoneItem = undoRedoManager.undo()

      expect(undoneItem.moment).toBe(67890)
      expect(undoneItem.layerIds).toEqual([2])
      expect(undoRedoManager.size()).toBe(2) // Item is still in forward stack
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.canRedo()).toBe(true)
    })

    it('should return undefined when undo is not possible', () => {
      const result = undoRedoManager.undo()

      expect(result).toBeUndefined()
    })

    it('should allow multiple undo operations', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer')

      const undo1 = undoRedoManager.undo()
      const undo2 = undoRedoManager.undo()
      const undo3 = undoRedoManager.undo()

      expect(undo1.moment).toBe(33333)
      expect(undo2.moment).toBe(22222)
      expect(undo3.moment).toBe(11111)
      expect(undoRedoManager.canUndo()).toBe(false)
      expect(undoRedoManager.canRedo()).toBe(true)
    })

    it('should update peek after undo', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')

      undoRedoManager.undo()

      const peeked = undoRedoManager.peek()
      expect(peeked.moment).toBe(11111)
    })
  })

  describe('redo', () => {
    it('should redo the most recently undone action', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer', [1])
      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer', [2])
      undoRedoManager.undo()

      const redoneItem = undoRedoManager.redo()

      expect(redoneItem.moment).toBe(67890)
      expect(redoneItem.layerIds).toEqual([2])
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.canRedo()).toBe(false)
    })

    it('should return undefined when redo is not possible', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      const result = undoRedoManager.redo()

      expect(result).toBeUndefined()
    })

    it('should allow multiple redo operations', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.undo()
      undoRedoManager.undo()

      const redo1 = undoRedoManager.redo()
      const redo2 = undoRedoManager.redo()
      const redo3 = undoRedoManager.redo()

      expect(redo1.moment).toBe(11111)
      expect(redo2.moment).toBe(22222)
      expect(redo3.moment).toBe(33333)
      expect(undoRedoManager.canRedo()).toBe(false)
      expect(undoRedoManager.canUndo()).toBe(true)
    })

    it('should support undo-redo-undo-redo sequences', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')

      undoRedoManager.undo()
      expect(undoRedoManager.peek().moment).toBe(11111)

      undoRedoManager.redo()
      expect(undoRedoManager.peek().moment).toBe(22222)

      undoRedoManager.undo()
      expect(undoRedoManager.peek().moment).toBe(11111)

      undoRedoManager.redo()
      expect(undoRedoManager.peek().moment).toBe(22222)
    })
  })

  describe('peek', () => {
    it('should return the most recent stack item', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer', [1])
      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer', [2])

      const peeked = undoRedoManager.peek()

      expect(peeked.moment).toBe(67890)
      expect(peeked.layerIds).toEqual([2])
    })

    it('should return undefined when stack is empty', () => {
      const peeked = undoRedoManager.peek()

      expect(peeked).toBeUndefined()
    })

    it('should not modify the stack', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      const sizeBefore = undoRedoManager.size()

      undoRedoManager.peek()

      expect(undoRedoManager.size()).toBe(sizeBefore)
      expect(undoRedoManager.canUndo()).toBe(true)
    })
  })

  describe('canUndo', () => {
    it('should return false when stack is empty', () => {
      expect(undoRedoManager.canUndo()).toBe(false)
    })

    it('should return true when stack has items', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.canUndo()).toBe(true)
    })

    it('should return false after undoing all items', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      expect(undoRedoManager.canUndo()).toBe(false)
    })

    it('should return true after redo', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.redo()

      expect(undoRedoManager.canUndo()).toBe(true)
    })
  })

  describe('canRedo', () => {
    it('should return false when there are no forward edits', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.canRedo()).toBe(false)
    })

    it('should return true after undo', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      expect(undoRedoManager.canRedo()).toBe(true)
    })

    it('should return false after redo', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.redo()

      expect(undoRedoManager.canRedo()).toBe(false)
    })

    it('should return false when forward stack is empty', () => {
      expect(undoRedoManager.canRedo()).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all stacks', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      undoRedoManager.clear()

      expect(undoRedoManager.size()).toBe(0)
      expect(undoRedoManager.canUndo()).toBe(false)
      expect(undoRedoManager.canRedo()).toBe(false)
      expect(undoRedoManager.isInitialized()).toBe(false)
      expect(undoRedoManager.peek()).toBeUndefined()
    })

    it('should allow adding items after clear', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.clear()

      undoRedoManager.add(67890, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.size()).toBe(1)
      expect(undoRedoManager.peek().moment).toBe(67890)
    })
  })

  describe('size', () => {
    it('should return 0 for empty stack', () => {
      expect(undoRedoManager.size()).toBe(0)
    })

    it('should return correct size with items', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.size()).toBe(3)
    })

    it('should include forward items in size', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      // Still 2: 1 in main stack, 1 in forward stack
      expect(undoRedoManager.size()).toBe(2)
    })

    it('should update size after redo', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.redo()

      expect(undoRedoManager.size()).toBe(2)
    })
  })

  describe('hasForwardEdits', () => {
    it('should return false when there are no forward edits', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      expect(undoRedoManager.hasForwardEdits()).toBe(false)
    })

    it('should return true after undo', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      expect(undoRedoManager.hasForwardEdits()).toBe(true)
    })

    it('should return false after clearing forward moments', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.clearForwardMoments()

      expect(undoRedoManager.hasForwardEdits()).toBe(false)
    })
  })

  describe('clearForwardMoments', () => {
    it('should clear forward stack only', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()

      undoRedoManager.clearForwardMoments()

      expect(undoRedoManager.hasForwardEdits()).toBe(false)
      expect(undoRedoManager.canRedo()).toBe(false)
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.peek().moment).toBe(11111)
    })

    it('should not affect main stack', () => {
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.undo()
      undoRedoManager.undo()

      undoRedoManager.clearForwardMoments()

      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.peek().moment).toBe(11111)
    })

    it('should do nothing if no forward edits exist', () => {
      undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

      undoRedoManager.clearForwardMoments()

      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.peek().moment).toBe(12345)
    })
  })

  describe('initialMoments', () => {
    it('should return empty array when not initialized', () => {
      const moments = undoRedoManager.initialMoments()

      expect(moments).toEqual([])
    })

    it('should return initial moment array', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')

      const moments = undoRedoManager.initialMoments()

      expect(moments).toHaveLength(1)
      expect(moments[0].moment).toBe(12345)
      expect(moments[0].serviceUrl).toBe('https://services.arcgis.com/test/FeatureServer')
    })

    it('should return cleared array after clear', () => {
      undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')
      undoRedoManager.clear()

      const moments = undoRedoManager.initialMoments()

      expect(moments).toEqual([])
    })
  })

  describe('complex workflows', () => {
    it('should handle complex undo-redo-add workflow', () => {
      // Initial edits
      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer', [1])
      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer', [2])
      undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer', [3])

      // Undo twice
      undoRedoManager.undo()
      undoRedoManager.undo()
      expect(undoRedoManager.peek().moment).toBe(11111)
      expect(undoRedoManager.canRedo()).toBe(true)

      // Add new edit (should implicitly handle forward stack)
      undoRedoManager.add(44444, 'https://services.arcgis.com/test/FeatureServer', [4])
      expect(undoRedoManager.peek().moment).toBe(44444)
    })

    it('should maintain correct state through multiple operations', () => {
      undoRedoManager.initialize(10000, 'https://services.arcgis.com/test/FeatureServer')

      undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.canRedo()).toBe(false)

      undoRedoManager.undo()
      expect(undoRedoManager.canUndo()).toBe(false)
      expect(undoRedoManager.canRedo()).toBe(true)

      undoRedoManager.redo()
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.canRedo()).toBe(false)

      undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
      expect(undoRedoManager.canUndo()).toBe(true)
      expect(undoRedoManager.canRedo()).toBe(false)
      expect(undoRedoManager.peek().moment).toBe(22222)
    })

    describe('getServiceCurrentMoment', () => {
      it('should return the most recent stack item for a service URL', () => {
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.add(22222, 'https://services.arcgis.com/other/FeatureServer')
        undoRedoManager.add(33333, 'https://services.arcgis.com/test/FeatureServer')

        const moment = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/test/FeatureServer')

        expect(moment.moment).toBe(33333)
        expect(moment.serviceUrl).toBe('https://services.arcgis.com/test/FeatureServer')
      })

      it('should return initial moment if no items in stack for service', () => {
        undoRedoManager.initialize(12345, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.add(67890, 'https://services.arcgis.com/other/FeatureServer')

        const moment = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/test/FeatureServer')

        expect(moment.moment).toBe(12345)
        expect(moment.serviceUrl).toBe('https://services.arcgis.com/test/FeatureServer')
      })

      it('should return undefined if service URL is not found', () => {
        undoRedoManager.add(12345, 'https://services.arcgis.com/test/FeatureServer')

        const moment = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/unknown/FeatureServer')

        expect(moment).toBeUndefined()
      })

      it('should prioritize stack items over initial moment', () => {
        undoRedoManager.initialize(10000, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.add(20000, 'https://services.arcgis.com/test/FeatureServer')

        const moment = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/test/FeatureServer')

        expect(moment.moment).toBe(20000)
      })

      it('should handle multiple services correctly', () => {
        undoRedoManager.initialize(10000, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.initialize(20000, 'https://services.arcgis.com/other/FeatureServer')
        undoRedoManager.add(30000, 'https://services.arcgis.com/test/FeatureServer')

        const moment1 = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/test/FeatureServer')
        const moment2 = undoRedoManager.getServiceCurrentMoment('https://services.arcgis.com/other/FeatureServer')

        expect(moment1.moment).toBe(30000)
        expect(moment2.moment).toBe(20000)
      })
      })

      describe('clone', () => {
      it('should create a deep clone of the manager', () => {
        undoRedoManager.initialize(10000, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer', [1, 2])
        undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer', [3])
        undoRedoManager.undo()

        const cloned = undoRedoManager.clone()

        expect(cloned.size()).toBe(undoRedoManager.size())
        expect(cloned.canUndo()).toBe(undoRedoManager.canUndo())
        expect(cloned.canRedo()).toBe(undoRedoManager.canRedo())
        expect(cloned.isInitialized()).toBe(true)
        expect(cloned.initialMoments()).toHaveLength(1)
      })

      it('should not share references with original manager', () => {
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer', [1])

        const cloned = undoRedoManager.clone()
        cloned.add(22222, 'https://services.arcgis.com/test/FeatureServer', [2])

        expect(undoRedoManager.size()).toBe(1)
        expect(cloned.size()).toBe(2)
        expect(undoRedoManager.peek().moment).toBe(11111)
        expect(cloned.peek().moment).toBe(22222)
      })

      it('should clone layerIds array independently', () => {
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer', [1, 2, 3])

        const cloned = undoRedoManager.clone()
        const clonedItem = cloned.peek()
        clonedItem.layerIds.push(4)

        expect(undoRedoManager.peek().layerIds).toEqual([1, 2, 3])
        expect(clonedItem.layerIds).toEqual([1, 2, 3, 4])
      })

      it('should clone timestamp independently', () => {
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')

        const cloned = undoRedoManager.clone()
        const originalTimestamp = undoRedoManager.peek().timestamp
        const clonedTimestamp = cloned.peek().timestamp

        expect(clonedTimestamp).toEqual(originalTimestamp)
        expect(clonedTimestamp).not.toBe(originalTimestamp)
      })

      it('should clone empty manager correctly', () => {
        const cloned = undoRedoManager.clone()

        expect(cloned.size()).toBe(0)
        expect(cloned.canUndo()).toBe(false)
        expect(cloned.canRedo()).toBe(false)
        expect(cloned.isInitialized()).toBe(false)
      })

      it('should clone forward stack items', () => {
        undoRedoManager.add(11111, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.add(22222, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.undo()

        const cloned = undoRedoManager.clone()

        expect(cloned.canRedo()).toBe(true)
        expect(cloned.redo().moment).toBe(22222)
      })

      it('should clone initial moments', () => {
        undoRedoManager.initialize(10000, 'https://services.arcgis.com/test/FeatureServer')
        undoRedoManager.initialize(20000, 'https://services.arcgis.com/other/FeatureServer')

        const cloned = undoRedoManager.clone()
        const clonedInitialMoments = cloned.initialMoments()

        expect(clonedInitialMoments).toHaveLength(2)
        expect(clonedInitialMoments[0].moment).toBe(10000)
        expect(clonedInitialMoments[1].moment).toBe(20000)
      })
      })
  })
})
