var DefaultDatatableDemo = function () {
	var demo = function () {
		var datatable = $('.m_datatable').mDatatable({
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'inc/api/datatables/demos/default.php'
					}
				},
				pageSize: 5, 
				saveState: {
					cookie: true,
					webstorage: true
				}, 
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true
			},
			layout: {
				theme: 'default', 
				class: '', 
				scroll: true, 
				height: 'auto', 
				footer: false 
			},
			sortable: true,
			toolbar: {
				placement: ['bottom'],
				items: {
					pagination: {
						pageSizeSelect: [5, 10, 20, 30, 50] 
					},
				}
			},
			search: {
				input: $('#generalSearch')
			},
			columns: [{
				field: "RecordID",
				title: "#",
				sortable: false, 
				width: 40,
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "OrderID",
				title: "Order ID",
				filterable: false, 
				width: 150,
				template: '{{OrderID}} - {{ShipCountry}}'
			}, {
				field: "ShipCountry",
				title: "Ship Country",
				width: 150,
				template: function (row) {
					return row.ShipCountry + ' - ' + row.ShipCity;
				}
			}, {
				field: "ShipCity",
				title: "Ship City",
				sortable: false 
			}, {
				field: "Currency",
				title: "Currency",
				width: 100
			}, {
				field: "ShipDate",
				title: "Ship Date",
				sortable: 'asc'
			}, {
				field: "Latitude",
				title: "Latitude"
			}, {
				field: "Status",
				title: "Status",
				template: function (row) {
					var status = {
						1: {'title': 'Pending', 'class': 'm-badge--brand'},
						2: {'title': 'Delivered', 'class': ' m-badge--metal'},
						3: {'title': 'Canceled', 'class': ' m-badge--primary'},
						4: {'title': 'Success', 'class': ' m-badge--success'},
						5: {'title': 'Info', 'class': ' m-badge--info'},
						6: {'title': 'Danger', 'class': ' m-badge--danger'},
						7: {'title': 'Warning', 'class': ' m-badge--warning'}
					};
					return '<span class="m-badge ' + status[row.Status].class + ' m-badge--wide">' + status[row.Status].title + '</span>';
				}
			}, {
				field: "Type",
				title: "Type",
				template: function (row) {
					var status = {
						1: {'title': 'Online', 'state': 'danger'},
						2: {'title': 'Retail', 'state': 'primary'},
						3: {'title': 'Direct', 'state': 'accent'}
					};
					return '<span class="m-badge m-badge--' + status[row.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.Type].state +'">' + status[row.Type].title + '</span>';
				}
			}, {
				field: "Actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row) {
					var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';
					return '\
						<div class="dropdown '+ dropup +'">\
							<a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                <i class="la la-ellipsis-h"></i>\
                            </a>\
						  	<div class="dropdown-menu dropdown-menu-right">\
						    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
						    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
						  	</div>\
						</div>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
							<i class="la la-trash"></i>\
						</a>\
					';
				}
			}]
		});
		$('#m_datatable_clear').on('click', function () {
			$('#m_datatable_console').html('');
		});
		$('#m_datatable_reload').on('click', function () {
			datatable.reload();
		});
	};
	var eventsCapture = function () {
		$('.m_datatable')
			.on('m-datatable--on-init', function () {
				eventsWriter('Datatable init');
			})
			.on('m-datatable--on-layout-updated', function () {
				eventsWriter('Layout render updated');
			})
			.on('m-datatable--on-ajax-done', function () {
				eventsWriter('Ajax data successfully updated');
			})
			.on('m-datatable--on-ajax-fail', function (e, jqXHR) {
				eventsWriter('Ajax error');
			})
			.on('m-datatable--on-goto-page', function (e, args) {
				eventsWriter('Goto to pagination: ' + args.page);
			})
			.on('m-datatable--on-update-perpage', function (e, args) {
				eventsWriter('Update page size: ' + args.perpage);
			})
			.on('m-datatable--on-reloaded', function (e) {
				eventsWriter('Datatable reloaded');
			})
			.on('m-datatable--on-check', function (e, args) {
				eventsWriter('Checkbox active: ' + args.toString());
			})
			.on('m-datatable--on-uncheck', function (e, args) {
				eventsWriter('Checkbox inactive: ' + args.toString());
			})
			.on('m-datatable--on-sort', function (e, args) {
				eventsWriter('Datatable sorted by ' + args.field + ' ' + args.sort);
			});
	};
	var eventsWriter = function (string) {
		var console = $('#m_datatable_console').append(string + "\t\n");
		$(console).scrollTop(console[0].scrollHeight - $(console).height());
	};
	return {
		init: function () {
			demo();
			eventsCapture();
		}
	};
}();
jQuery(document).ready(function () {
	DefaultDatatableDemo.init();
});
