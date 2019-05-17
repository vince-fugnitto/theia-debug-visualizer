/********************************************************************************
 * Copyright (C) 2019 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable, postConstruct } from 'inversify';
import { StatusBar, StatusBarEntry, StatusBarAlignment } from '@theia/core/lib/browser';
import { DebugCommands } from '@theia/debug/lib/browser/debug-frontend-application-contribution';
import { DebugSessionManager } from '@theia/debug/lib/browser/debug-session-manager';
import { DefaultFrontendApplicationContribution } from '@theia/core/lib/browser/frontend-application';
import { DebugConfigurationManager } from '@theia/debug/lib/browser/debug-configuration-manager';

@injectable()
export class DebugConnectionStatusContribution extends DefaultFrontendApplicationContribution {

    @inject(DebugConfigurationManager)
    protected readonly configManager: DebugConfigurationManager;

    @inject(DebugSessionManager)
    protected readonly sessionManager: DebugSessionManager;

    @inject(StatusBar)
    protected readonly statusBar: StatusBar;

    protected readonly RUN_STATUSBAR_ID: string = 'run-debug-statusbar-item';

    @postConstruct()
    async init() {
        this.sessionManager.onDidStartDebugSession(() => this.handleStarted());
        this.sessionManager.onDidDestroyDebugSession(() => this.handleStopped());
    }

    /**
     * Update the status-bar to reflect started debug session.
     */
    protected handleStarted(): void {
        const text: string = this.configManager.current ? this.configManager.current.configuration.name : 'Start Debugging';
        this.statusBar.setElement(this.RUN_STATUSBAR_ID, {
            alignment: StatusBarAlignment.LEFT,
            text: '$(play) ' + text,
            tooltip: 'Run Debug Configuration',
            priority: 1000,
            command: DebugCommands.START.id,
        });
        this.statusBar.setBackgroundColor('#ea7600');
        this.statusBar.setColor('#ffffff');
    }

    /**
     * Update the status-bar to reflect stopped debug session.
     */
    protected handleStopped(): void {
        this.statusBar.setBackgroundColor(undefined);
        this.statusBar.setColor(undefined);
    }
}