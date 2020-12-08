var DatatableLocalSortDemo = function () {
	var demo = function () {
		var datatable = $('.m_datatable').mDatatable({
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'inc/api/datatables/demos/default.php'
					}
				},
				pageSize: 10,
				saveState: {
					cookie: true,
					webstorage: true
				},
				serverPaging: false,
				serverFiltering: true,
				serverSorting: false
			},
			layout: {
				theme: 'default', 
				class: '', 
				scroll: false, 
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
				width: 50,
				sortable: false, 
				selector: false,
				textAlign: 'center'
			}, {
				field: "OrderID",
				title: "Order ID",
				filterable: false, 
				template: '{{OrderID}} - {{ShipCountry}}'
			}, {
				field: "TotalPayment",
				title: "Payment",
				type: "number",
				sortCallback: function (data, sort, column) {
					var field = column['field'];
					return $(data).sort(function (a, b) {
						var aField = a[field];
						var bField = b[field];
						if (isNaN(parseFloat(aField)) && aField != null) {
							aField = Number(aField.replace(/[^0-9\.-]+/g, ""));
						}
						if (isNaN(parseFloat(bField)) && aField != null) {
							bField = Number(bField.replace(/[^0-9\.-]+/g, ""));
						}
						aField = parseFloat(aField);
						bField = parseFloat(bField);
						if (sort === 'asc') {
							return aField > bField ? 1 : aField < bField ? -1 : 0;
						} else {
							return aField < bField ? 1 : aField > bField ? -1 : 0;
						}
					});
				}
			}, {
				field: "ShipDate",
				title: "Ship Date",
				type: "date",
				format: "MM/DD/YYYY"
			}, {
				field: "PaymentDate",
				title: "Payment Date",
				width: 150,
				type: "date",
				format: "YYYY-MM-DD HH:mm:ss"
			}, {
				field: "Latitude",
				title: "Latitude",
				type: "number"
			}, {
				field: "Longitude",
				title: "Longitude",
				type: "number"
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
		});
		var query = datatable.getDataSourceQuery();
		$('#m_form_status').on('change', function () {
			var query = datatable.getDataSourceQuery();
			query.Status = $(this).val().toLowerCase();
			datatable.setDataSourceQuery(query);
			datatable.load();
		}).val(typeof query.Status !== 'undefined' ? query.Status : '');
		$('#m_form_type').on('change', function () {
			var query = datatable.getDataSourceQuery();
			query.Type = $(this).val().toLowerCase();
			datatable.setDataSourceQuery(query);
			datatable.load();
		}).val(typeof query.Type !== 'undefined' ? query.Type : '');
		$('#m_form_status, #m_form_type').selectpicker();
	};
	return {
		init: function () {
			demo();
		}
	};
}();
jQuery(document).ready(function () {
	DatatableLocalSortDemo.init();
});
