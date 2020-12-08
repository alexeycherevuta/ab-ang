var DatatableColumnWidthDemo = function () {
	var demo = function () {
		var datatable = $('.m_datatable').mDatatable({
			data: {
				type: 'remote',
				source: {
					read: {
						url: 'http:
					}
				},
				pageSize: 10,
				saveState: {
					cookie: true,
					webstorage: true
				},
				serverPaging: true,
				serverFiltering: false,
				serverSorting: true
			},
			layout: {
				theme: 'default', 
				class: '', 
				scroll: false, 
				height: null, 
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
				textAlign: 'center',
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "OrderID",
				title: "Order ID",
				sortable: 'asc', 
				filterable: false, 
				width: 150
			}, {
				field: "Notes",
				title: "Notes",
				width: 700
			}, {
				field: "CompanyAgent",
				title: "Agent"
			}, {
				field: "ShipDate",
				title: "Ship Date"
			}, {
				field: "Actions",
				width: 110,
				title: "Actions",
				sortable: false,
				overflow: 'visible',
				template: function (row) {
					var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';
					return '<span>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View details">\
							<i class="la la-ellipsis-h"></i>\
						</a>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="Edit details">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill" title="Delete">\
							<i class="la la-trash"></i>\
						</a>\
					</span>';
				}
			}]
		});
	};
	return {
		init: function () {
			demo();
		}
	};
}();
jQuery(document).ready(function () {
	DatatableColumnWidthDemo.init();
});
