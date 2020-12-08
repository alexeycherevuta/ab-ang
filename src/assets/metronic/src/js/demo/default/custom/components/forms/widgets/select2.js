var Select2 = function() {
    var demos = function() {
        $('#m_select2_1, #m_select2_1_validate').select2({
            placeholder: "Select a state"
        });
        $('#m_select2_2, #m_select2_2_validate').select2({
            placeholder: "Select a state"
        });
        $('#m_select2_3, #m_select2_3_validate').select2({
            placeholder: "Select a state",
        });
        $('#m_select2_4').select2({
            placeholder: "Select a state",
            allowClear: true
        });
        var data = [{
            id: 0,
            text: 'Enhancement'
        }, {
            id: 1,
            text: 'Bug'
        }, {
            id: 2,
            text: 'Duplicate'
        }, {
            id: 3,
            text: 'Invalid'
        }, {
            id: 4,
            text: 'Wontfix'
        }];
        $('#m_select2_5').select2({
            placeholder: "Select a value",
            data: data
        });
        function formatRepo(repo) {
            if (repo.loading) return repo.text;
            var markup = "<div class='select2-result-repository clearfix'>" +
                "<div class='select2-result-repository__meta'>" +
                "<div class='select2-result-repository__title'>" + repo.full_name + "</div>";
            if (repo.description) {
                markup += "<div class='select2-result-repository__description'>" + repo.description + "</div>";
            }
            markup += "<div class='select2-result-repository__statistics'>" +
                "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + repo.forks_count + " Forks</div>" +
                "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + repo.stargazers_count + " Stars</div>" +
                "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + repo.watchers_count + " Watchers</div>" +
                "</div>" +
                "</div></div>";
            return markup;
        }
        function formatRepoSelection(repo) {
            return repo.full_name || repo.text;
        }
        $("#m_select2_6").select2({
            placeholder: "Search for git repositories",
            allowClear: true,
            ajax: {
                url: "https:
                dataType: 'json',
                delay: 250,
                data: function(params) {
                    return {
                        q: params.term, 
                        page: params.page
                    };
                },
                processResults: function(data, params) {
                    params.page = params.page || 1;
                    return {
                        results: data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
            },
            escapeMarkup: function(markup) {
                return markup;
            }, 
            minimumInputLength: 1,
            templateResult: formatRepo, 
            templateSelection: formatRepoSelection 
        });
        $('#m_select2_12_1, #m_select2_12_2, #m_select2_12_3, #m_select2_12_4').select2({
            placeholder: "Select an option",
        });
        $('#m_select2_7').select2({
            placeholder: "Select an option"
        });
        $('#m_select2_8').select2({
            placeholder: "Select an option"
        });
        $('#m_select2_9').select2({
            placeholder: "Select an option",
            maximumSelectionLength: 2
        });
        $('#m_select2_10').select2({
            placeholder: "Select an option",
            minimumResultsForSearch: Infinity
        });
        $('#m_select2_11').select2({
            placeholder: "Add a tag",
            tags: true
        });
    }
    var modalDemos = function() {
        $('#m_select2_modal').on('shown.bs.modal', function () {
            $('#m_select2_1_modal').select2({
                placeholder: "Select a state"
            });
            $('#m_select2_2_modal').select2({
                placeholder: "Select a state"
            });
            $('#m_select2_3_modal').select2({
                placeholder: "Select a state",
            });
            $('#m_select2_4_modal').select2({
                placeholder: "Select a state",
                allowClear: true
            }); 
        });
    }
    return {
        init: function() {
            demos();
            modalDemos();
        }
    };
}();
jQuery(document).ready(function() {
    Select2.init();
});
