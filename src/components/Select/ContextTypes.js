/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import { optionShape, optionList } from '../Input/PropTypes';

const CONTEXT_TYPES = {
    expanded: PropTypes.bool,
    hideMenu: PropTypes.func,
    inputID: PropTypes.string,
    inputName: PropTypes.string,
    mappedOptions: PropTypes.objectOf(optionShape),
    multiple: PropTypes.bool,
    options: optionList,
    selectValue: PropTypes.func,
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    showMenu: PropTypes.func,
    toggleMenu: PropTypes.func,
    uid: PropTypes.string
};

export default CONTEXT_TYPES;