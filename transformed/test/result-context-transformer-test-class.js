"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformTestClass = void 0;
class TransformTestClass {
    constructor() {
        console.log('test');
    }
    static testProtectedStatic1({ params }) {
        return params;
    }
    static testProtectedStatic2(params) {
        return params;
    }
    static testProtectedStatic3(params) {
        return params;
    }
    static testPublicStatic1({ params }) {
        return params;
    }
    static testPublicStatic2(params) {
        return params;
    }
    static testPublicStatic3(params) {
        return params;
    }
    static testStatic1({ params }) {
        return params;
    }
    static testStatic2(params) {
        return params;
    }
    static testStatic3(params) {
        return params;
    }
    static async testProtectedStaticAsync1({ params, }) {
        return params;
    }
    static async testProtectedStaticAsync2(params) {
        return params;
    }
    static async testProtectedStaticAsync3(params) {
        return params;
    }
    static async testPublicStaticAsync1({ params, }) {
        return params;
    }
    static async testPublicStaticAsync2(params) {
        return params;
    }
    static async testPublicStaticAsync3(params) {
        return params;
    }
    static async testStaticAsync1({ params }) {
        return params;
    }
    static async testStaticAsync2(params) {
        return params;
    }
    static async testStaticAsync3(params) {
        return params;
    }
    async testProtectedAsync1({ params, }) {
        return params;
    }
    async testProtectedAsync2(params) {
        return params;
    }
    async testProtectedAsync3(params) {
        return params;
    }
    async testPublicAsync1({ params }) {
        return params;
    }
    async testPublicAsync2(params) {
        return params;
    }
    async testPublicAsync3(params) {
        return params;
    }
    async testAsync1({ params }) {
        return params;
    }
    async testAsync2(params) {
        return params;
    }
    async testAsync3(params) {
        return params;
    }
    complexParams({ params, id, }) {
        return { params, id };
    }
    async testNotResult(params) {
        return { test: 'sdsd' };
    }
    async testNotResult1(params) {
        return 'sdsd';
    }
    testNotResult2(params) {
        return 'sdsd';
    }
    testNotResult3(params) {
        return 'sdsd';
    }
}
exports.TransformTestClass = TransformTestClass;
