describe('Namespace Spec', function () {
    beforeEach(function() {
        window['namespace'] = {};
    });

    afterEach(function() {
        delete window['namespace'];
    });

    it('Can create a new namespace', function () {
        expect(typeof window['namespace'].test === 'undefined').to.equal(true);

        jsutils.Namespace.create('namespace.test', { test: true });

        expect(typeof window['namespace'].test === 'undefined').to.equal(false);
    });

    it('Will throw an error if attempting to create an object on a pre-existing namespace', function() {
        sinon.spy(jsutils.Namespace, 'create');

        expect(typeof window['namespace'].test === 'undefined').to.equal(true);

        jsutils.Namespace.create('namespace.test', { test: true });

        expect(typeof window['namespace'].test === 'undefined').to.equal(false);
        expect(jsutils.Namespace.create.threw()).to.equal(false);

        try {
            jsutils.Namespace.create('namespace.test', { test: true });
        } catch(e) {
            // do nothing
        }

        expect(jsutils.Namespace.create.threw()).to.equal(true);

        jsutils.Namespace.create.restore();
    })
});
