// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

'use strict';

import * as assert from 'assert';
import { JavaTestRunnerDelegateCommands } from "../../src/constants";
import { IJUnitLaunchArguments, Response } from "../../src/runners/baseRunner/BaseRunner";
import { executeJavaLanguageServerCommand } from "../../src/utils/commandUtils";
import { setupTestEnv } from "./utils";
import { exportedForTesting } from "../../src/utils/launchUtils";
import { TestLevel, TestKind } from '../../src/java-test-runner.api';

// tslint:disable: only-arrow-functions
// tslint:disable: no-object-literal-type-assertion
suite('LaunchUtils Tests', () => {

    suiteSetup(async function() {
        await setupTestEnv();
    });

    test('Resolve JUnit 5 parameterized test 1', async () => {
        const argument: Response<IJUnitLaunchArguments> | undefined = await executeJavaLanguageServerCommand<Response<IJUnitLaunchArguments>>(
            JavaTestRunnerDelegateCommands.RESOLVE_JUNIT_ARGUMENT, JSON.stringify({
                projectName: 'junit',
                testLevel: TestLevel.Method,
                testKind: TestKind.JUnit5,
                testNames: ['=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit5{ParameterizedAnnotationTest.java[ParameterizedAnnotationTest~canRunWithComment~QString;~QBoolean;'],
            })
        );
        assert.strictEqual(
            argument?.body?.programArguments[argument?.body?.programArguments.length - 1],
            'junit5.ParameterizedAnnotationTest:canRunWithComment(java.lang.String,java.lang.Boolean)'
        );
    });

    test('Resolve JUnit 5 parameterized test 2', async () => {
        const argument: Response<IJUnitLaunchArguments> | undefined = await executeJavaLanguageServerCommand<Response<IJUnitLaunchArguments>>(
            JavaTestRunnerDelegateCommands.RESOLVE_JUNIT_ARGUMENT, JSON.stringify({
                projectName: 'junit',
                testLevel: TestLevel.Method,
                testKind: TestKind.JUnit5,
                testNames: ['=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit5{ParameterizedAnnotationTest.java[ParameterizedAnnotationTest~equal~I~I'],
            })
        );
        assert.strictEqual(
            argument?.body?.programArguments[argument?.body?.programArguments.length - 1],
            'junit5.ParameterizedAnnotationTest:equal(int,int)'
        );
    });

    test('Resolve JUnit 5 parameterized test 3', async () => {
        const argument: Response<IJUnitLaunchArguments> | undefined = await executeJavaLanguageServerCommand<Response<IJUnitLaunchArguments>>(
            JavaTestRunnerDelegateCommands.RESOLVE_JUNIT_ARGUMENT, JSON.stringify({
                projectName: 'junit',
                testLevel: TestLevel.Method,
                testKind: TestKind.JUnit5,
                testNames: ['=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit5{ParameterizedAnnotationTest.java[ParameterizedAnnotationTest~canRunWithGenericTypedParameter~QList\\<QInteger;>;'],
            })
        );
        assert.strictEqual(
            argument?.body?.programArguments[argument?.body?.programArguments.length - 1],
            'junit5.ParameterizedAnnotationTest:canRunWithGenericTypedParameter(java.util.List)'
        );
    });

    test('Resolve JUnit 5 parameterized test 4', async () => {
        const argument: Response<IJUnitLaunchArguments> | undefined = await executeJavaLanguageServerCommand<Response<IJUnitLaunchArguments>>(
            JavaTestRunnerDelegateCommands.RESOLVE_JUNIT_ARGUMENT, JSON.stringify({
                projectName: 'junit',
                testLevel: TestLevel.Method,
                testKind: TestKind.JUnit5,
                testNames: ['=junit/src\\/test\\/java=/optional=/true=/=/maven.pomderived=/true=/=/test=/true=/<junit5{ParameterizedAnnotationTest.java[ParameterizedAnnotationTest~testCheckUser~QUser;'],
            })
        );
        assert.strictEqual(
            argument?.body?.programArguments[argument?.body?.programArguments.length - 1],
            'junit5.ParameterizedAnnotationTest:testCheckUser(junit5.ParameterizedAnnotationTest$User)'
        );
    });

    test('test parseTags()', () => {
        const { parseTags } = exportedForTesting;
        const config = {
            testKind: 'junit',
            filters: {
                tags: [
                    "foo",
                    "!bar",
                    "develop",
                    "!production"
                ]
            }
        };
        const tags: string[] = parseTags(config);
        const expected: string[] = [
            "--include-tag",
            "foo",
            "--exclude-tag",
            "bar",
            "--include-tag",
            "develop",
            "--exclude-tag",
            "production"
        ]
        assert.ok(tags.length === expected.length && tags.every((tag, idx) => tag === expected[idx]));
    });

    test('test parseTags() when testKind is not set', () => {
        const { parseTags } = exportedForTesting;
        const config = {
            filters: {
                tags: [
                    "foo",
                ]
            }
        };
        assert.ok(parseTags(config).length === 0);
    });
});
