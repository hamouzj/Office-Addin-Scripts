// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

/**
 * Test the linkedEntityDataProvider tag in combination with the requiresParameterAddresses tag
 * @param linkedEntityId Unique `LinkedEntityId` of the `LinkedEntityCellValue`s which is being requested for resolution/refresh.
 * @param handler my handler
 * @customfunction
 * @linkedEntityDataProvider
 * @requiresParameterAddresses
 * @returns Resolved/Updated `LinkedEntityCellValue` that was requested by the passed-in id.
 */
async function linkedEntityDataProviderTest(linkedEntityId: unknown, handler: CustomFunctions.Invocation): Promise<any> {
    // Empty
}
