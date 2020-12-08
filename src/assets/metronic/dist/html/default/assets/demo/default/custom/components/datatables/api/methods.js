var DefaultDatatableDemo = function () {
	var demo = function () {
		var options = {
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'http:
					}
				},
				pageSize: 20, 
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
				height: 550, 
				footer: false 
			},
			sortable: true,
			pagination: true,
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
				title: "Ship City"
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
					return '<span class="m-badge m-badge--' + status[row.Type].state + ' m-badge--dot"></span>&nbsp;<span class="m--font-bold m--font-' + status[row.Type].state + '">' + status[row.Type].title + '</span>';
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
						<div class="dropdown ' + dropup + '">\
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
		};
		var datatable = $('.m_datatable').mDatatable(options);
		$('#m_datatable_destroy').on('click', function () {
			datatable.destroy();
		});
		$('#m_datatable_init').on('click', function () {
			datatable = $('.m_datatable').mDatatable(options);
		});
		$('#m_datatable_reload').on('click', function () {
			datatable.reload();
		});
		$('#m_datatable_sort').on('click', function () {
			datatable.sort('ShipCity');
		});
		$('#m_datatable_get').on('click', function () {
			var value = datatable.setSelectedRecords().getColumn('ShipCity').getValue();
			if (value === '') value = 'Select checbox';
			$('#datatable_value').html(value);
		});
		$('#m_datatable_check').on('click', function () {
			var input = $('#m_datatable_check_input').val();
			datatable.setActive(input);
		});
		$('#m_datatable_check_all').on('click', function () {
			datatable.setActiveAll(true);
		});
		$('#m_datatable_uncheck_all').on('click', function () {
			datatable.setActiveAll(false);
		});
		$('#m_datatable_hide_column').on('click', function () {
			datatable.hideColumn('Currency');
		});
		$('#m_datatable_show_column').on('click', function () {
      datatable.showColumn('Currency');
		});
	};
	return {
		init: function () {
			demo();
		}
	};
}();
jQuery(document).ready(function () {
	DefaultDatatableDemo.init();
});
