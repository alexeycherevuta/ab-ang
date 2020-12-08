var DatatableTranslationDemo = function () {
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
				selector: {class: 'm-checkbox--solid m-checkbox--brand'}
			}, {
				field: "OrderID",
				title: "Order ID",
				sortable: 'asc', 
				filterable: false, 
				width: 150
			}, {
				field: "ShipCity",
				title: "Ship City"
			}, {
				field: "ShipName",
				title: "Ship Name",
				width: 150
			}, {
				field: "CompanyEmail",
				title: "Email",
				width: 150
			}, {
				field: "CompanyAgent",
				title: "Agent"
			}, {
				field: "Department",
				title: "Department"
			}, {
				field: "ShipDate",
				title: "Ship Date"
			}],
			translate: {
				records: {
					processing: 'Cargando...',
					noRecords: 'No se encontrarón archivos'
				},
				toolbar: {
					pagination: {
						items: {
							default: {
								first: 'Primero',
								prev: 'Anterior',
								next: 'Siguiente',
								last: 'Último',
								more: 'Más páginas',
								input: 'Número de página',
								select: 'Seleccionar tamaño de página'
							},
							info: 'Viendo {{start}} - {{end}} de {{total}} registros'
						}
					}
				}
			}
		});
	};
	return {
		init: function () {
			demo();
		}
	};
}();
jQuery(document).ready(function () {
	DatatableTranslationDemo.init();
});
