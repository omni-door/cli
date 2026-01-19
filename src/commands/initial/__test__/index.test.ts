import { describe, it } from 'mocha';
import { expect } from 'chai';
import initial from '../index';
import {
  cli_basic_react,
  cli_standard_react,
  cli_entire_react,
  cli_pc_react,
  cli_basic_vue,
  cli_standard_vue,
  cli_entire_vue,
  cli_ssr_react,
  cli_components_react,
  cli_components_vue,
  cli_toolkit
} from '../initial_preset';

describe('initial command test', function () {
  it('type checking', function () {
    expect(initial).to.be.a('function');
  });
});

/**
 * Preset test data for parameterized testing
 * Each preset defines its expected configuration values
 */
interface PresetTestCase {
  name: string;
  preset: Record<string, unknown>;
  expected: {
    build: string;
    pkgtool: string;
    project_type: string;
    ts: boolean;
    testFrame: string;
    eslint: boolean;
    commitlint: boolean;
    style: string;
    stylelint: boolean;
    // Optional fields for specific presets
    prettier?: boolean;
    serverType?: string;
    devServer?: string;
  };
}

const presetTestCases: PresetTestCase[] = [
  {
    name: 'cli_basic_react',
    preset: cli_basic_react,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-react',
      ts: false,
      testFrame: '',
      eslint: false,
      commitlint: false,
      style: 'css',
      stylelint: false
    }
  },
  {
    name: 'cli_standard_react',
    preset: cli_standard_react,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-react',
      ts: true,
      testFrame: '',
      eslint: true,
      commitlint: false,
      style: 'less',
      stylelint: true
    }
  },
  {
    name: 'cli_entire_react',
    preset: cli_entire_react,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-react',
      ts: true,
      testFrame: 'jest',
      eslint: true,
      commitlint: true,
      style: 'all',
      stylelint: true
    }
  },
  {
    name: 'cli_pc_react',
    preset: cli_pc_react,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-react-pc',
      ts: true,
      testFrame: '',
      eslint: true,
      commitlint: true,
      style: 'less',
      stylelint: true
    }
  },
  {
    name: 'cli_basic_vue',
    preset: cli_basic_vue,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-vue',
      ts: false,
      testFrame: '',
      eslint: false,
      commitlint: false,
      style: 'css',
      stylelint: false
    }
  },
  {
    name: 'cli_standard_vue',
    preset: cli_standard_vue,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-vue',
      ts: true,
      testFrame: '',
      eslint: true,
      commitlint: false,
      style: 'less',
      stylelint: true
    }
  },
  {
    name: 'cli_entire_vue',
    preset: cli_entire_vue,
    expected: {
      build: 'webpack',
      pkgtool: 'pnpm',
      project_type: 'spa-vue',
      ts: true,
      testFrame: 'jest',
      eslint: true,
      commitlint: true,
      style: 'all',
      stylelint: true
    }
  },
  {
    name: 'cli_ssr_react',
    preset: cli_ssr_react,
    expected: {
      build: 'next',
      pkgtool: 'pnpm',
      project_type: 'ssr-react',
      ts: true,
      testFrame: 'jest',
      eslint: true,
      commitlint: true,
      style: 'all',
      stylelint: true,
      prettier: true,
      serverType: 'next-app'
    }
  },
  {
    name: 'cli_components_react',
    preset: cli_components_react,
    expected: {
      build: 'tsc',
      pkgtool: 'yarn',
      project_type: 'component-react',
      ts: true,
      testFrame: 'jest',
      eslint: true,
      commitlint: true,
      style: 'less',
      stylelint: true,
      devServer: 'storybook'
    }
  },
  {
    name: 'cli_components_vue',
    preset: cli_components_vue,
    expected: {
      build: 'tsc',
      pkgtool: 'yarn',
      project_type: 'component-vue',
      ts: true,
      testFrame: 'jest',
      eslint: true,
      commitlint: true,
      style: 'less',
      stylelint: true,
      devServer: 'storybook'
    }
  },
  {
    name: 'cli_toolkit',
    preset: cli_toolkit,
    expected: {
      build: 'rollup',
      pkgtool: 'yarn',
      project_type: 'toolkit',
      ts: true,
      testFrame: 'mocha',
      eslint: true,
      commitlint: true,
      style: '',
      stylelint: false
    }
  }
];

describe('initial preset test', function () {
  presetTestCases.forEach(({ name, preset, expected }) => {
    describe(`${name} checking`, function () {
      it('should be an object', function () {
        expect(preset).to.be.an('object');
      });

      it('should have correct build tool', function () {
        expect(preset.build).to.be.a('string');
        expect(preset.build).to.equal(expected.build);
      });

      it('should have correct package tool', function () {
        expect(preset.pkgtool).to.be.a('string');
        expect(preset.pkgtool).to.equal(expected.pkgtool);
      });

      it('should have correct project type', function () {
        expect(preset.project_type).to.be.a('string');
        expect(preset.project_type).to.equal(expected.project_type);
      });

      it('should have correct TypeScript setting', function () {
        expect(preset.ts).to.be.a('boolean');
        expect(preset.ts).to.equal(expected.ts);
      });

      it('should have correct test framework', function () {
        expect(preset.testFrame).to.be.a('string');
        expect(preset.testFrame).to.equal(expected.testFrame);
      });

      it('should have correct ESLint setting', function () {
        expect(preset.eslint).to.be.a('boolean');
        expect(preset.eslint).to.equal(expected.eslint);
      });

      it('should have correct commitlint setting', function () {
        expect(preset.commitlint).to.be.a('boolean');
        expect(preset.commitlint).to.equal(expected.commitlint);
      });

      it('should have correct style setting', function () {
        expect(preset.style).to.be.a('string');
        expect(preset.style).to.equal(expected.style);
      });

      it('should have correct stylelint setting', function () {
        expect(preset.stylelint).to.be.a('boolean');
        expect(preset.stylelint).to.equal(expected.stylelint);
      });

      // Optional fields
      if (expected.prettier !== undefined) {
        it('should have correct prettier setting', function () {
          expect(preset.prettier).to.be.a('boolean');
          expect(preset.prettier).to.equal(expected.prettier);
        });
      }

      if (expected.serverType !== undefined) {
        it('should have correct server type', function () {
          expect(preset.serverType).to.be.a('string');
          expect(preset.serverType).to.equal(expected.serverType);
        });
      }

      if (expected.devServer !== undefined) {
        it('should have correct dev server', function () {
          expect(preset.devServer).to.be.a('string');
          expect(preset.devServer).to.equal(expected.devServer);
        });
      }
    });
  });
});
