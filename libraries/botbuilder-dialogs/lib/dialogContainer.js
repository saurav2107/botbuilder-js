"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module botbuilder-dialogs
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const dialog_1 = require("./dialog");
const dialogContext_1 = require("./dialogContext");
const dialogSet_1 = require("./dialogSet");
/**
 * The `DialogContainer` class lets you break your bots logic up into components that can be added
 * as a dialog to other dialog sets within your bots project or exported and used in other bot
 * projects.
 *
 * @remarks
 * `DialogContainers` allow for the creation of libraries of reusable dialog components.
 *
 * #### Component Creation
 *
 * To create a reusable dialog component you'll want to define a new class derived from
 * `DialogContainer`. Your component has its own `DialogSet` which you can add dialogs to from
 * within your classes constructor.  You can add as many dialogs as you like and the dialogs can
 * be waterfalls, prompts, or even other component dialogs.
 *
 * Since developers will add instances of your component to their bots as other named dialogs, the
 * DialogContainer needs to know the ID of the initial dialog it should start anytime it's started.
 *
 * Here's a fairly simple example of a `ProfileDialog` that's designed to prompt the user to
 * enter their name and phone number which it will return as a JSON object to the caller:
 *
 * ```JavaScript
 * const { DialogContainer, TextPrompt } = require('botbuilder-dialogs');
 *
 * class ProfileDialog extends DialogContainer {
 *     constructor() {
 *         super('fillProfile');
 *
 *         this.dialogs.add('fillProfile', [
 *             async function (dc, options) {
 *                 dc.instance.state = {};
 *                 await dc.prompt('textPrompt', `What's your name?`);
 *             },
 *             async function (dc, name) {
 *                 dc.instance.state.name = name;
 *                 await dc.prompt('textPrompt', `What's your phone number?`);
 *             },
 *             async function (dc, phone) {
 *                 dc.instance.state.phone = phone;
 *
 *                 // Return completed profile
 *                 await dc.end(dc.instance.state);
 *            }
 *        ]);
 *
 *        this.dialogs.add('textPrompt', new TextPrompt());
 *     }
 * }
 * module.exports.ProfileDialog = ProfileDialog;
 * ```
 *
 * We've added two dialogs to our component, a waterfall and a prompt. And we've told the
 * DialogContainer that it should start the 'fillProfile' dialog anytime an instance of the
 * `ProfileDialog` is started. The DialogContainer will manager persisting the controls dialog
 * stack to the callers dialog stack.
 *
 * #### Component Usage
 *
 * On the consumption side the dialog we created can be used by a bot in much the same way they
 * would use any other prompt. They can add a new instance of the component as a named dialog to
 * their bots `DialogSet` and then start it using a call to `DialogContext.begin()`. If the
 * dialog accepts options these can be passed in to the `begin()` call and the `DialogContainer`
 * will pass them through as args to the initial dialog it starts.
 *
 * ```JavaScript
 * const { DialogSet } = require('botbuilder-dialogs');
 * const { ProfileDialog } = require('./profileControl');
 *
 * const dialogs = new DialogSet();
 *
 * dialogs.add('getProfile', new ProfileDialog());
 *
 * dialogs.add('firstrun', [
 *      async function (dc) {
 *          await dc.context.sendActivity(`Welcome! We need to ask a few questions to get started.`);
 *          await dc.begin('getProfile');
 *      },
 *      async function (dc, profile) {
 *          await dc.context.sendActivity(`Thanks ${profile.name}!`);
 *          await dc.end();
 *      }
 * ]);
 * ```
 * @param R (Optional) type of result that's expected to be returned by the dialog.
 * @param O (Optional) options that can be passed into the begin() method.
 */
class DialogContainer extends dialog_1.Dialog {
    /**
     * Creates a new `DialogContainer` instance.
     * @param initialDialogId ID of the dialog, within the containers dialog set, that should be started anytime an instance of the `DialogContainer` is started.
     */
    constructor(initialDialogId) {
        super();
        this.initialDialogId = initialDialogId;
        /** The containers dialog set. */
        this.dialogs = new dialogSet_1.DialogSet();
    }
    dialogBegin(dc, dialogArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            // Start the inner dialog.
            const cdc = new dialogContext_1.DialogContext(this.dialogs, dc.context, dc.activeDialog.state);
            const turnResult = yield cdc.begin(this.initialDialogId, dialogArgs);
            // Check for end of inner dialog 
            if (turnResult.hasResult) {
                // Return result to calling dialog
                return yield dc.end(turnResult.result);
            }
            else {
                // Just signal end of turn
                return dialog_1.Dialog.EndOfTurn;
            }
        });
    }
    dialogContinue(dc) {
        return __awaiter(this, void 0, void 0, function* () {
            // Continue execution of inner dialog.
            const cdc = new dialogContext_1.DialogContext(this.dialogs, dc.context, dc.activeDialog.state);
            const turnResult = yield cdc.continue();
            // Check for end of inner dialog 
            if (turnResult.hasResult) {
                // Return result to calling dialog
                return yield dc.end(turnResult.result);
            }
            else {
                // Just signal end of turn
                return dialog_1.Dialog.EndOfTurn;
            }
        });
    }
}
exports.DialogContainer = DialogContainer;
//# sourceMappingURL=dialogContainer.js.map