/**
 * Available patch operation types
 *
 * @export
 * @enum {number}
 */
export enum PatchOpType {
    Add = "add",
    Remove = "remove",
    Replace = "replace",
    Move = "move",
    Copy = "copy",
    Test = "test"
}

/**
 * Interface defining basic patch operation
 *
 * @export
 * @interface IPatch
 * @template T
 */
export interface IPatch<T> {
    // The type of patch operation
    op: PatchOpType;

    // The patch of the field to update as part of the patch operation
    path: string;

    // The new value to set the (path) field to 
    value: T;
}

/**
 * Base patch implementation
 *
 * @export
 * @abstract
 * @class BasePatch
 * @implements {IPatch<T>}
 * @template T
 */
export abstract class BasePatch<T> implements IPatch<T> {
    readonly op: PatchOpType;
    path: string;
    value: T;

    /**
     * Creates an instance of BasePatch.
     * @param {PatchOpType} op The type of patch operation
     * @param {string} path The patch of the field to update as part of the patch operation
     * @param {T} value The new value to set the (path) field to
     * @memberof BasePatch
     */
    constructor(op: PatchOpType, path: string, value: T) {
        this.op = op;
        this.path = path;
        this.value = value;
    }
}
/**
 * A multi-patch item. Can be used stand along or as part of an array of MultiPatchItem's to in effect send a batch of different
 * patch operations to apply to different documents as specified by the array of IDs.
 *
 * @export
 * @class MultiPatchItem
 */
export class MultiPatchItem {
    ids: string[] = [];
    patchDocument: IPatch<any>[] = [];
}

/**
 * Add patch implementation
 *
 * @export
 * @class AddPatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class AddPatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Add, path, value);
    }
}

/**
 * Remove patch implementation
 *
 * @export
 * @class RemovePatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class RemovePatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Remove, path, value);
    }
}

/**
 * Replace (i.e. update) patch implementation
 *
 * @export
 * @class ReplacePatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class ReplacePatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Replace, path, value);
    }
}

/**
 * Move patch implementation
 *
 * @export
 * @class MovePatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class MovePatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Move, path, value);
    }
}

/**
 * Copy patch implementation
 *
 * @export
 * @class CopyPatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class CopyPatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Copy, path, value);
    }
}

/**
 * Test patch implementation
 *
 * @export
 * @class TestPatch
 * @extends {BasePatch<T>}
 * @template T
 */
export class TestPatch<T> extends BasePatch<T> {
    constructor(path: string, value: T) {
        super(PatchOpType.Test, path, value);
    }
}
