/**
 * JavaScript for form editing completion conditions.
 *
 * @module moodle-availability_ctcompletion-form
 */
M.availability_ctcompletion = M.availability_ctcompletion || {};

/**
 * @class M.availability_ctcompletion.form
 * @extends M.core_availability.plugin
 */
M.availability_ctcompletion.form = Y.Object(M.core_availability.plugin);

/**
 * Initialises this plugin.
 *
 * @method initInner
 * @param {Array} cms Array of objects containing cmid => name
 */
M.availability_ctcompletion.form.initInner = function(cms) {
    this.cms = cms;
};

M.availability_ctcompletion.form.getNode = function(json) {
    // Create HTML structure.
    var html = '<span class="col-form-label pr-3"> ' + M.util.get_string('title', 'availability_ctcompletion') + '</span>' +
               ' <span class="availability-group form-group"><label>' +
            '<span class="accesshide">' + M.util.get_string('label_cm', 'availability_ctcompletion') + ' </span>' +
            '<select class="custom-select" name="cm" title="' + M.util.get_string('label_cm', 'availability_ctcompletion') + '">' +
            '<option value="0">' + M.util.get_string('choosedots', 'moodle') + '</option>';
    for (var i = 0; i < this.cms.length; i++) {
        var cm = this.cms[i];
        // String has already been escaped using format_string.
        html += '<option value="' + cm.id + '">' + cm.name + '</option>';
    }
    html += '</select></label> <label><span class="accesshide">' +
                M.util.get_string('label_completion', 'availability_ctcompletion') +
            ' </span><select class="custom-select" ' +
                            'name="e" title="' + M.util.get_string('label_completion', 'availability_ctcompletion') + '">' +
            '<option value="1">' + M.util.get_string('option_complete', 'availability_ctcompletion') + '</option>' +
            '<option value="0">' + M.util.get_string('option_incomplete', 'availability_ctcompletion') + '</option>' +
            '<option value="2">' + M.util.get_string('option_pass', 'availability_ctcompletion') + '</option>' +
            '<option value="3">' + M.util.get_string('option_fail', 'availability_ctcompletion') + '</option>' +
            '<option value="4">' + M.util.get_string('option_ctcompletion', 'availability_ctcompletion') + '</option>' +
            '</select></label></span>';
    var node = Y.Node.create('<span class="form-inline">' + html + '</span>');

    // Set initial values.
    if (json.cm !== undefined &&
            node.one('select[name=cm] > option[value=' + json.cm + ']')) {
        node.one('select[name=cm]').set('value', '' + json.cm);
    }
    if (json.e !== undefined) {
        node.one('select[name=e]').set('value', '' + json.e);
    }

    // Add event handlers (first time only).
    if (!M.availability_ctcompletion.form.addedEvents) {
        M.availability_ctcompletion.form.addedEvents = true;
        var root = Y.one('.availability-field');
        root.delegate('change', function() {
            // Whichever dropdown changed, just update the form.
            M.core_availability.form.update();
        }, '.availability_ctcompletion select');
    }

    return node;
};

M.availability_ctcompletion.form.fillValue = function(value, node) {
    value.cm = parseInt(node.one('select[name=cm]').get('value'), 10);
    value.e = parseInt(node.one('select[name=e]').get('value'), 10);
};

M.availability_ctcompletion.form.fillErrors = function(errors, node) {
    var cmid = parseInt(node.one('select[name=cm]').get('value'), 10);
    if (cmid === 0) {
        errors.push('availability_ctcompletion:error_selectcmid');
    }
    var e = parseInt(node.one('select[name=e]').get('value'), 10);
    if (((e === 2) || (e === 3))) {
        this.cms.forEach(function(cm) {
            if (cm.id === cmid) {
                if (cm.completiongradeitemnumber === null) {
                    errors.push('availability_ctcompletion:error_selectcmidpassfail');
                }
            }
        });
    }
};
