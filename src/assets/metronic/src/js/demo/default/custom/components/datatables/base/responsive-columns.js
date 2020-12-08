var DatatableResponsiveColumnsDemo = function () {
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
				serverPaging: true,
				serverFiltering: true,
				serverSorting: true
			},
			layout: {
				theme: 'default', 
				class: '', 
				scroll: false, 
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
				textAlign: 'center',
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "OrderID",
				title: "Order ID",
				filterable: false, 
				width: 150
			}, {
				field: "ShipCity",
				title: "Ship City",
				responsive: {visible: 'lg'}
			}, {
				field: "Website",
				title: "Website",
				width: 200,
				responsive: {visible: 'lg'}
			}, {
				field: "Department",
				title: "Department",
				responsive: {visible: 'lg'}
			}, {
				field: "ShipDate",
				title: "Ship Date",
				responsive: {visible: 'lg'}
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
	};
	return {
		init: function () {
			demo();
		}
	};
}();
jQuery(document).ready(function () {
	DatatableResponsiveColumnsDemo.init();
});
