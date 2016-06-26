import {getFirstMatch} from './utilities';
import {ComponentType, PropType} from '../entities';
import {TypeType} from 'librarian-plugin-javascript/src/entities';

describe('component', () => {

  function getFirstComponent(source, {prefixWithImport = true} = {}) {
    if (prefixWithImport && source.trim().indexOf('import React') !== 0) {
      source = `import React, {Component, PropTypes} from 'react';\n${source}`;
    }

    return getFirstMatch({source, type: ComponentType});
  }

  function getFirstProp(source, opts) {
    return getFirstComponent(source, opts).props[0];
  }

  it('works', () => {
    const component = getFirstComponent(`
      export default class MyComponent extends Component {}
    `);

    expect(component)
      .to.be.an.entityOfType(ComponentType)
      .with.properties({name: 'MyComponent'});
  });

  describe('props', () => {
    context('static class members', () => {
      it('finds the props', () => {
        const component = getFirstComponent(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(component)
          .to.have.deep.property('props[0]')
          .to.be.an.entityOfType(PropType)
          .with.properties({name: 'selected'});
      });
    });

    describe('.isRequired', () => {
      it('is not required by default', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is required when isRequired is called', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool.isRequired};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is not required with a non-matching computed key', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: false});
      });

      it('is not required with a matching evaluated computed key', () => {
        const prop = getFirstProp(`
          const isRequired = 'isRequired';

          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool[isRequired]};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('is required with a matching computed key', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool['isRequired']};
          }
        `);

        expect(prop).to.have.properties({isRequired: true});
      });

      it('evaluates the property of the required type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool.isRequired};
          }
        `);

        expect(prop)
          .to.have.property('type')
          .that.is.an.entityOfType(TypeType)
          .with.properties({type: 'boolean'});
      });
    });

    describe('.type', () => {
      it('handles a boolean type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.bool};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('boolean');
      });

      it('handles a string type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.string};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('string');
      });

      it('handles a number type', () => {
        const prop = getFirstProp(`
          export default class MyComponent extends Component {
            static propTypes = {selected: PropTypes.number};
          }
        `);

        expect(prop)
          .to.have.deep.property('type.type')
          .that.equals('number');
      });
    });
  });
});
