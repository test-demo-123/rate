import * as cliArgs from './cli-args';
describe('cli args', () => {
    it('should have args', () => {
        expect(cliArgs.args).toBeTruthy()
    })
})