/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';

export default Object.freeze({
    activeIndex: PropTypes.number.isRequired,
    hideSection: PropTypes.func.isRequired,
    isSectionActive: PropTypes.func.isRequired,
    isSectionCollapsible: PropTypes.func.isRequired,
    showSection: PropTypes.func.isRequired,
    toggleSection: PropTypes.func.isRequired,
    uid: PropTypes.string.isRequired
});