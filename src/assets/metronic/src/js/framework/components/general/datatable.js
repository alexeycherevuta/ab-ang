(function($) {
  if (typeof mUtil === 'undefined') throw new Error(
      'mUtil is required and must be included before mDatatable.');
  $.fn.mDatatable = function(options) {
    if ($(this).hasClass('m-datatable--loaded')) return;
    if ($(this).length === 0) throw new Error('No mDatatable element exist.');
    if ($(this).attr('id') === '') throw new Error('ID is required.');
    var datatable = this;
    datatable.debug = false;
    var dt = {
      offset: 110,
      stateId: 'm-meta',
      init: function(options) {
        dt.setupBaseDOM.call();
        dt.setupDOM(datatable.table);
        API.setDataSourceQuery(API.getOption('data.source.read.params.query'));
        $(datatable).on('m-datatable--on-layout-updated', dt.afterRender);
        if (datatable.debug) dt.stateRemove(dt.stateId);
        if (options.data.type === 'remote' || options.data.type === 'local') {
          if (options.data.saveState === false
              || options.data.saveState.cookie === false
              && options.data.saveState.webstorage === false) {
            dt.stateRemove(dt.stateId);
          }
          if (options.data.type === 'local' &&
              typeof options.data.source === 'object') {
            if (options.data.source === null) {
              dt.extractTable();
            }
            datatable.dataSet = datatable.originalDataSet
                = dt.dataMapCallback(options.data.source);
          }
          dt.dataRender();
        }
        dt.setHeadTitle.call();
        dt.setHeadTitle.call(this, datatable.tableFoot);
        if (options.data.type === null) {
          dt.setupCellField.call();
          dt.setupTemplateCell.call();
          dt.setupSystemColumn.call();
        }
        if (typeof options.layout.header !== 'undefined' &&
            options.layout.header === false) {
          $(datatable.table).find('thead').remove();
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer === false) {
          $(datatable.table).find('tfoot').remove();
        }
        if (options.data.type === null ||
            options.data.type === 'local') dt.layoutUpdate();
        $(window).resize(dt.fullRender);
        $(datatable).height('');
        $(API.getOption('search.input')).on('keyup', function(e) {
          API.search($(this).val().toLowerCase());
        });
        return datatable;
      },
      extractTable: function() {
        var columns = [];
        var headers = $(datatable).
            find('tr:first-child th').
            get().
            map(function(cell, i) {
              var field = $(cell).data('field');
              if (typeof field === 'undefined') {
                field = $(cell).text();
              }
              var column = {field: field, title: field};
              for (var ii in options.columns) {
                if (options.columns[ii].field === field) {
                  column = $.extend(true, {}, options.columns[ii], column);
                }
              }
              columns.push(column);
              return field;
            });
        options.columns = columns;
        var data = $(datatable).find('tr').get().map(function(row) {
          return $(row).find('td').get().map(function(cell, i) {
            return $(cell).html();
          });
        });
        var source = [];
        $.each(data, function(i, row) {
          if (row.length === 0) return;
          var td = {};
          $.each(row, function(index, value) {
            td[headers[index]] = value;
          });
          source.push(td);
        });
        options.data.source = source;
      },
      layoutUpdate: function() {
        dt.setupSubDatatable.call();
        dt.setupSystemColumn.call();
        dt.columnHide.call();
        dt.sorting.call();
        dt.setupHover.call();
        if (typeof options.detail === 'undefined'
            && dt.getDepth() === 1) {
          dt.lockTable.call();
        }
        $(datatable).
            trigger('m-datatable--on-layout-updated',
                {table: $(datatable.table).attr('id')});
      },
      lockTable: function() {
        var lock = {
          lockEnabled: false,
          init: function() {
            lock.lockEnabled = $.grep(options.columns, function(n, i) {
              return typeof n.locked !== 'undefined' && n.locked !== false;
            });
            if (lock.lockEnabled.length === 0) return;
            if (!dt.isLocked()) {
              datatable.oriTable = $(datatable.table).clone();
            }
            lock.enable();
          },
          enable: function() {
            var enableLock = function(tablePart) {
              var lockEnabled = lock.lockEnabledColumns();
              if (lockEnabled.left.length === 0 &&
                  lockEnabled.right.length === 0) {
                return;
              }
              if ($(tablePart).find('.m-datatable__lock').length > 0) {
                dt.log('Locked container already exist in: ', tablePart);
                return;
              }
              if ($(tablePart).find('.m-datatable__row').length === 0) {
                dt.log('No row exist in: ', tablePart);
                return;
              }
              var lockLeft = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--left');
              var lockScroll = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--scroll');
              var lockRight = $('<div/>').
                  addClass('m-datatable__lock m-datatable__lock--right');
              $(tablePart).find('.m-datatable__row').each(function() {
                var rowLeft = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockLeft);
                var rowScroll = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockScroll);
                var rowRight = $('<tr/>').
                    addClass('m-datatable__row').
                    appendTo(lockRight);
                $(this).find('.m-datatable__cell').each(function() {
                  var locked = $(this).data('locked');
                  if (typeof locked !== 'undefined') {
                    if (typeof locked.left !== 'undefined' || locked === true) {
                      $(this).appendTo(rowLeft);
                    }
                    if (typeof locked.right !== 'undefined') {
                      $(this).appendTo(rowRight);
                    }
                  } else {
                    $(this).appendTo(rowScroll);
                  }
                });
                $(this).remove();
              });
              if (lockEnabled.left.length > 0) {
                $(datatable.wrap).addClass('m-datatable--lock');
                $(lockLeft).appendTo(tablePart);
              }
              if (lockEnabled.left.length > 0 || lockEnabled.right.length > 0) {
                $(lockScroll).appendTo(tablePart);
              }
              if (lockEnabled.right.length > 0) {
                $(datatable.wrap).addClass('m-datatable--lock');
                $(lockRight).appendTo(tablePart);
              }
            };
            $(datatable.table).find('thead,tbody,tfoot').each(function() {
              var tablePart = this;
              if ($(this).find('.m-datatable__lock').length === 0) {
                $(this).ready(function() {
                  enableLock(tablePart);
                });
              }
            });
          },
          lockEnabledColumns: function() {
            var screen = $(window).width();
            var columns = options.columns;
            var enabled = {left: [], right: []};
            $.each(columns, function(i, column) {
              if (typeof column.locked !== 'undefined') {
                if (typeof column.locked.left !== 'undefined') {
                  if (mUtil.getBreakpoint(column.locked.left) <= screen) {
                    enabled['left'].push(column.locked.left);
                  }
                }
                if (typeof column.locked.right !== 'undefined') {
                  if (mUtil.getBreakpoint(column.locked.right) <= screen) {
                    enabled['right'].push(column.locked.right);
                  }
                }
              }
            });
            return enabled;
          },
        };
        lock.init();
        return lock;
      },
      fullRender: function() {
        dt.spinnerCallback(true);
        $(datatable.wrap).removeClass('m-datatable--loaded');
        if (dt.isLocked()) {
          var content = $(datatable.oriTable).children();
          if (content.length > 0) {
            $(datatable.wrap).removeClass('m-datatable--lock');
            $(datatable.table).empty().html(content);
            datatable.oriTable = null;
            dt.setupCellField.call();
            API.redraw();
          }
          dt.updateTableComponents.call();
        }
        dt.insertData();
      },
      afterRender: function(e, args) {
        if (args.table === $(datatable.table).attr('id')) {
          if (!dt.isLocked()) API.redraw();
          $(datatable).ready(function() {
            $(datatable.tableBody).
                find('.m-datatable__row:even').
                addClass('m-datatable__row--even');
            if (dt.isLocked()) API.redraw();
            $(datatable.tableBody).css('visibility', '');
            $(datatable.wrap).addClass('m-datatable--loaded');
            dt.scrollbar.call();
            dt.spinnerCallback(false);
          });
        }
      },
      setupHover: function() {
        $(datatable.tableBody).
            find('.m-datatable__cell').
            off('mouseenter', 'mouseleave').
            on('mouseenter', function() {
              var row = $(this).
                  closest('.m-datatable__row').
                  addClass('m-datatable__row--hover');
              var index = $(row).index() + 1;
              $(row).
                  closest('.m-datatable__lock').
                  parent().
                  find('.m-datatable__row:nth-child(' + index + ')').
                  addClass('m-datatable__row--hover');
            }).
            on('mouseleave', function() {
              var row = $(this).
                  closest('.m-datatable__row').
                  removeClass('m-datatable__row--hover');
              var index = $(row).index() + 1;
              $(row).
                  closest('.m-datatable__lock').
                  parent().
                  find('.m-datatable__row:nth-child(' + index + ')').
                  removeClass('m-datatable__row--hover');
            });
      },
      adjustLockContainer: function() {
        if (!dt.isLocked()) return 0;
        var containerWidth = $(datatable.tableHead).width();
        var lockLeft = $(datatable.tableHead).
            find('.m-datatable__lock--left').
            width();
        var lockRight = $(datatable.tableHead).
            find('.m-datatable__lock--right').
            width();
        if (typeof lockLeft === 'undefined') lockLeft = 0;
        if (typeof lockRight === 'undefined') lockRight = 0;
        var lockScroll = Math.floor(containerWidth - lockLeft - lockRight);
        $(datatable.table).
            find('.m-datatable__lock--scroll').
            css('width', lockScroll);
        return lockScroll;
      },
      dragResize: function() {
        var pressed = false;
        var start = undefined;
        var startX, startWidth;
        $(datatable.tableHead).
            find('.m-datatable__cell').
            mousedown(function(e) {
              start = $(this);
              pressed = true;
              startX = e.pageX;
              startWidth = $(this).width();
              $(start).addClass('m-datatable__cell--resizing');
            }).
            mousemove(function(e) {
              if (pressed) {
                var i = $(start).index();
                var tableBody = $(datatable.tableBody);
                var ifLocked = $(start).closest('.m-datatable__lock');
                if (ifLocked) {
                  var lockedIndex = $(ifLocked).index();
                  tableBody = $(datatable.tableBody).
                      find('.m-datatable__lock').
                      eq(lockedIndex);
                }
                $(tableBody).find('.m-datatable__row').each(function(tri, tr) {
                  $(tr).
                      find('.m-datatable__cell').
                      eq(i).
                      width(startWidth + (e.pageX - startX)).
                      children().
                      width(startWidth + (e.pageX - startX));
                });
                $(start).children().width(startWidth + (e.pageX - startX));
              }
            }).
            mouseup(function() {
              $(start).removeClass('m-datatable__cell--resizing');
              pressed = false;
            });
        $(document).mouseup(function() {
          $(start).removeClass('m-datatable__cell--resizing');
          pressed = false;
        });
      },
      initHeight: function() {
        if (options.layout.height && options.layout.scroll) {
          var theadHeight = $(datatable.tableHead).
              find('.m-datatable__row').
              height();
          var tfootHeight = $(datatable.tableFoot).
              find('.m-datatable__row').
              height();
          var bodyHeight = options.layout.height;
          if (typeof theadHeight !== 'undefined') bodyHeight -= theadHeight;
          if (typeof tfootHeight !== 'undefined') bodyHeight -= tfootHeight;
          $(datatable.tableBody).css('max-height', bodyHeight);
        }
      },
      setupBaseDOM: function() {
        datatable.old = $(datatable).clone();
        if ($(datatable).prop('tagName') === 'TABLE') {
          datatable.table = $(datatable).
              removeClass('m-datatable').
              addClass('m-datatable__table');
          if ($(datatable.table).parents('.m-datatable').length === 0) {
            datatable.table.wrap($('<div/>').
                addClass('m-datatable').
                addClass('m-datatable--' + options.layout.theme));
            datatable.wrap = $(datatable.table).parent();
          }
        } else {
          datatable.wrap = $(datatable).
              addClass('m-datatable').
              addClass('m-datatable--' + options.layout.theme);
          datatable.table = $('<table/>').
              addClass('m-datatable__table').
              appendTo(datatable);
        }
        if (typeof options.layout.class !== 'undefined') {
          $(datatable.wrap).addClass(options.layout.class);
        }
        $(datatable.table).
            removeClass('m-datatable--destroyed').
            css('display', 'block').
            attr('id', mUtil.getUniqueID('m-datatable--'));
        if (API.getOption('layout.height')) $(datatable.table).
            css('max-height', API.getOption('layout.height'));
        if (options.data.type === null) {
          $(datatable.table).css('width', '').css('display', '');
        }
        datatable.tableHead = $(datatable.table).find('thead');
        if ($(datatable.tableHead).length === 0) {
          datatable.tableHead = $('<thead/>').prependTo(datatable.table);
        }
        datatable.tableBody = $(datatable.table).find('tbody');
        if ($(datatable.tableBody).length === 0) {
          datatable.tableBody = $('<tbody/>').appendTo(datatable.table);
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer) {
          datatable.tableFoot = $(datatable.table).find('tfoot');
          if ($(datatable.tableFoot).length === 0) {
            datatable.tableFoot = $('<tfoot/>').appendTo(datatable.table);
          }
        }
      },
      setupCellField: function(tableParts) {
        if (typeof tableParts === 'undefined') tableParts = $(datatable.table).
            children();
        var columns = options.columns;
        $.each(tableParts, function(part, tablePart) {
          $(tablePart).find('.m-datatable__row').each(function(tri, tr) {
            $(tr).find('.m-datatable__cell').each(function(tdi, td) {
              if (typeof columns[tdi] !== 'undefined') {
                $(td).data(columns[tdi]);
              }
            });
          });
        });
      },
      setupTemplateCell: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        var columns = options.columns;
        $(tablePart).find('.m-datatable__row').each(function(tri, tr) {
          var obj = $(tr).data('obj') || {};
          var rowCallback = API.getOption('rows.callback');
          if (typeof rowCallback === 'function') {
            rowCallback(tr, obj, tri);
          }
          obj['getIndex'] = function() {
            return tri;
          };
          obj['getDatatable'] = function() {
            return datatable;
          };
          if (typeof obj === 'undefined') {
            obj = {};
            $(tr).find('.m-datatable__cell').each(function(tdi, td) {
              var column = $.grep(columns, function(n, i) {
                return $(td).data('field') === n.field;
              })[0];
              if (typeof column !== 'undefined') {
                obj[column['field']] = $(td).text();
              }
            });
          }
          $(tr).find('.m-datatable__cell').each(function(tdi, td) {
            var column = $.grep(columns, function(n, i) {
              return $(td).data('field') === n.field;
            })[0];
            if (typeof column !== 'undefined') {
              if (typeof column.template !== 'undefined') {
                var finalValue = '';
                if (typeof column.template === 'string') {
                  finalValue = dt.dataPlaceholder(column.template, obj);
                }
                if (typeof column.template === 'function') {
                  finalValue = column.template(obj);
                }
                var span = $('<span/>').append(finalValue);
                $(td).html(span);
                if (typeof column.overflow !== 'undefined') {
                  $(span).css('overflow', column.overflow);
                }
              }
            }
          });
        });
      },
      setupSystemColumn: function() {
        datatable.dataSet = datatable.dataSet || [];
        if (datatable.dataSet.length === 0) return;
        var columns = options.columns;
        $(datatable.tableBody).
            find('.m-datatable__row').
            each(function(tri, tr) {
              $(tr).find('.m-datatable__cell').each(function(tdi, td) {
                var column = $.grep(columns, function(n, i) {
                  return $(td).data('field') === n.field;
                })[0];
                if (typeof column !== 'undefined') {
                  var value = $(td).text();
                  if (typeof column.selector !== 'undefined' &&
                      column.selector !== false) {
                    if ($(td).find('.m-checkbox [type="checkbox"]').length >
                        0) return;
                    $(td).addClass('m-datatable__cell--check');
                    var chk = $('<label/>').
                        addClass('m-checkbox m-checkbox--single').
                        append($('<input/>').
                            attr('type', 'checkbox').
                            attr('value', value).
                            on('click', function() {
                              if ($(this).is(':checked')) {
                                API.setActive(this);
                              } else {
                                API.setInactive(this);
                              }
                            })).
                        append($('<span/>'));
                    if (typeof column.selector.class !== 'undefined') {
                      $(chk).addClass(column.selector.class);
                    }
                    $(td).children().html(chk);
                  }
                  if (typeof column.subtable !== 'undefined' &&
                      column.subtable) {
                    if ($(td).find('.m-datatable__toggle-subtable').length >
                        0) return;
                    $(td).
                        children().
                        html($('<a/>').
                            addClass('m-datatable__toggle-subtable').
                            attr('href', '#').
                            attr('data-value', value).
                            append($('<i/>').
                                addClass(API.getOption(
                                    'layout.icons.rowDetail.collapse'))));
                  }
                }
              });
            });
        var initCheckbox = function(tr) {
          var column = $.grep(columns, function(n, i) {
            return typeof n.selector !== 'undefined' && n.selector !== false;
          })[0];
          if (typeof column !== 'undefined') {
            if (typeof column.selector !== 'undefined' &&
                column.selector !== false) {
              var td = $(tr).find('[data-field="' + column.field + '"]');
              if ($(td).find('.m-checkbox [type="checkbox"]').length >
                  0) return;
              $(td).addClass('m-datatable__cell--check');
              var chk = $('<label/>').
                  addClass('m-checkbox m-checkbox--single m-checkbox--all').
                  append($('<input/>').
                      attr('type', 'checkbox').
                      on('click', function() {
                        if ($(this).is(':checked')) {
                          API.setActiveAll(true);
                        } else {
                          API.setActiveAll(false);
                        }
                      })).
                  append($('<span/>'));
              if (typeof column.selector.class !== 'undefined') {
                $(chk).addClass(column.selector.class);
              }
              $(td).children().html(chk);
            }
          }
        };
        if (typeof options.layout.header !== 'undefined' &&
            options.layout.header === true) {
          initCheckbox(
              $(datatable.tableHead).find('.m-datatable__row').first());
        }
        if (typeof options.layout.footer !== 'undefined' &&
            options.layout.footer === true) {
          initCheckbox(
              $(datatable.tableFoot).find('.m-datatable__row').first());
        }
      },
      adjustCellsWidth: function() {
        var containerWidth = $(datatable.tableHead).width();
        var sortOffset = 20;
        var columns = dt.getOneRow(datatable.tableHead, 1).length;
        if (columns > 0) {
          containerWidth = containerWidth - (sortOffset * columns);
          var minWidth = Math.floor(containerWidth / columns);
          if (minWidth <= dt.offset) {
            minWidth = dt.offset;
          }
          $(datatable.table).
              find('.m-datatable__row').
              find('.m-datatable__cell').
              each(function(tdi, td) {
                var width = minWidth;
                var dataWidth = $(td).data('width');
                if (typeof dataWidth !== 'undefined') {
                  width = dataWidth;
                }
                $(td).children().css('width', width);
              });
        }
      },
      adjustCellsHeight: function() {
        $(datatable.table).find('.m-datatable__row');
        $.each($(datatable.table).children(), function(part, tablePart) {
          for (var i = 1; i <= dt.getTotalRows(tablePart); i++) {
            var rows = dt.getOneRow(tablePart, i, false);
            if ($(rows).length > 0) {
              var maxHeight = Math.max.apply(null, $(rows).map(function() {
                return $(this).height();
              }).get());
              $(rows).css('height', Math.ceil(maxHeight));
            }
          }
        });
      },
      setupDOM: function(table) {
        $(table).find('> thead').addClass('m-datatable__head');
        $(table).find('> tbody').addClass('m-datatable__body');
        $(table).find('> tfoot').addClass('m-datatable__foot');
        $(table).find('tr').addClass('m-datatable__row');
        $(table).find('tr > th, tr > td').addClass('m-datatable__cell');
        $(table).find('tr > th, tr > td').each(function(i, td) {
          if ($(td).find('span').length === 0) {
            $(td).wrapInner($('<span/>').width(dt.offset));
          }
        });
      },
      scrollbar: function() {
        var scroll = {
          tableLocked: null,
          mcsOptions: {
            scrollInertia: 0,
            autoDraggerLength: true,
            autoHideScrollbar: true,
            autoExpandScrollbar: false,
            alwaysShowScrollbar: 0,
            mouseWheel: {
              scrollAmount: 120,
              preventDefault: false,
            },
            advanced: {
              updateOnContentResize: true,
              autoExpandHorizontalScroll: true,
            },
            theme: 'minimal-dark',
          },
          init: function() {
            var screen = mUtil.getViewPort().width;
            if (options.layout.scroll) {
              $(datatable.wrap).addClass('m-datatable--scroll');
              var scrollable = $(datatable.tableBody).
                  find('.m-datatable__lock--scroll');
              if ($(scrollable).length > 0) {
                scroll.scrollHead = $(datatable.tableHead).
                    find('> .m-datatable__lock--scroll > .m-datatable__row');
                scroll.scrollFoot = $(datatable.tableFoot).
                    find('> .m-datatable__lock--scroll > .m-datatable__row');
                scroll.tableLocked = $(datatable.tableBody).
                    find('.m-datatable__lock:not(.m-datatable__lock--scroll)');
                if (screen > mUtil.getBreakpoint('lg')) {
                  scroll.mCustomScrollbar(scrollable);
                } else {
                  scroll.defaultScrollbar(scrollable);
                }
              } else {
                scroll.scrollHead = $(datatable.tableHead).
                    find('> .m-datatable__row');
                scroll.scrollFoot = $(datatable.tableFoot).
                    find('> .m-datatable__row');
                if (screen > mUtil.getBreakpoint('lg')) {
                  scroll.mCustomScrollbar(datatable.tableBody);
                } else {
                  scroll.defaultScrollbar(datatable.tableBody);
                }
              }
            } else {
              $(datatable.table).
                  css('height', 'auto').
                  css('overflow-x', 'auto');
            }
          },
          defaultScrollbar: function(scrollable) {
            $(scrollable).
                css('overflow', 'auto').
                css('max-height', API.getOption('layout.height')).
                on('scroll', scroll.onScrolling);
          },
          onScrolling: function(e) {
            var left = $(this).scrollLeft();
            var top = $(this).scrollTop();
            $(scroll.scrollHead).css('left', -left);
            $(scroll.scrollFoot).css('left', -left);
            $(scroll.tableLocked).each(function(i, table) {
              $(table).css('top', -top);
            });
          },
          mCustomScrollbar: function(scrollable) {
            var height = API.getOption('layout.height');
            var axis = 'xy';
            if (height === null) {
              axis = 'x';
            }
            var mcsOptions = $.extend({}, scroll.mcsOptions, {
              axis: axis,
              setHeight: $(datatable.tableBody).height(),
              callbacks: {
                whileScrolling: function() {
                  var mcs = this.mcs;
                  $(scroll.scrollHead).css('left', mcs.left);
                  $(scroll.scrollFoot).css('left', mcs.left);
                  $(scroll.tableLocked).each(function(i, table) {
                    $(table).css('top', mcs.top);
                  });
                },
              },
            });
            if (API.getOption('layout.smoothScroll.scrollbarShown') === true) {
              $(scrollable).attr('data-scrollbar-shown', 'true');
            }
            dt.mCustomScrollbar(scrollable, mcsOptions);
            $(scrollable).mCustomScrollbar('scrollTo', 'top');
          },
        };
        scroll.init();
        return scroll;
      },
      mCustomScrollbar: function(element, options) {
        $(datatable.tableBody).css('overflow', '');
        if ($(element).find('.mCustomScrollbar').length === 0) {
          if ($(datatable.tableBody).hasClass('mCustomScrollbar')) {
            $(datatable.tableBody).mCustomScrollbar('destroy');
          }
          $(element).mCustomScrollbar(options);
        }
      },
      setHeadTitle: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableHead;
        var columns = options.columns;
        var row = $(tablePart).find('.m-datatable__row');
        var ths = $(tablePart).find('.m-datatable__cell');
        if ($(row).length === 0) {
          row = $('<tr/>').appendTo(tablePart);
        }
        $.each(columns, function(i, column) {
          var th = $(ths).eq(i);
          if ($(th).length === 0) {
            th = $('<th/>').appendTo(row);
          }
          if (typeof column['title'] !== 'undefined') {
            $(th).
                html(column['title']).
                attr('data-field', column.field).
                data(column);
          }
          if (typeof column.textAlign !== 'undefined') {
            var align = typeof datatable.textAlign[column.textAlign] !==
            'undefined' ? datatable.textAlign[column.textAlign] : '';
            $(th).addClass(align);
          }
        });
        dt.setupDOM(tablePart);
      },
      dataRender: function(action) {
        $(datatable.table).
            siblings('.m-datatable__pager').
            removeClass('m-datatable--paging-loaded');
        var buildMeta = function() {
          datatable.dataSet = datatable.dataSet || [];
          dt.localDataUpdate();
          var meta = API.getDataSourceParam('pagination');
          if (meta.perpage === 0) {
            meta.perpage = options.data.pageSize || 10;
          }
          meta.total = datatable.dataSet.length;
          var start = Math.max(meta.perpage * (meta.page - 1), 0);
          var end = Math.min(start + meta.perpage, meta.total);
          datatable.dataSet = $(datatable.dataSet).slice(start, end);
          return meta;
        };
        var afterGetData = function(result) {
          $(datatable.wrap).removeClass('m-datatable--error');
          if (options.pagination) {
            if (options.data.serverPaging && options.data.type !== 'local') {
              dt.paging(dt.getObject('meta', result || null));
            } else {
              dt.paging(buildMeta(), function(ctx, meta) {
                if (!$(ctx.pager).hasClass('m-datatable--paging-loaded')) {
                  $(ctx.pager).remove();
                  ctx.init(meta);
                }
                $(ctx.pager).off().on('m-datatable--on-goto-page', function(e) {
                  $(ctx.pager).remove();
                  ctx.init(meta);
                });
                var start = Math.max(meta.perpage * (meta.page - 1), 0);
                var end = Math.min(start + meta.perpage, meta.total);
                dt.localDataUpdate();
                datatable.dataSet = $(datatable.dataSet).slice(start, end);
                dt.insertData();
              });
            }
          } else {
            dt.localDataUpdate();
          }
          dt.insertData();
        };
        if (options.data.type === 'local'
            || typeof options.data.source.read === 'undefined' &&
            datatable.dataSet !== null
            || options.data.serverSorting === false && action === 'sort'
        ) {
          afterGetData();
          return;
        }
        dt.getData().done(afterGetData);
      },
      insertData: function() {
        datatable.dataSet = datatable.dataSet || [];
        var params = API.getDataSourceParam();
        var tableBody = $('<tbody/>').
            addClass('m-datatable__body').
            css('visibility', 'hidden');
        $.each(datatable.dataSet, function(i, row) {
          var tr = $('<tr/>').attr('data-row', i).data('obj', row);
          var idx = 0;
          var tdArr = [];
          var colLength = options.columns.length;
          for (var a = 0; a < colLength; a += 1) {
            var column = options.columns[a];
            var classes = [];
            if (params.sort.field === column.field) {
              classes.push('m-datatable__cell--sorted');
            }
            if (typeof column.textAlign !== 'undefined') {
              var align = typeof datatable.textAlign[column.textAlign] !==
              'undefined' ? datatable.textAlign[column.textAlign] : '';
              classes.push(align);
            }
            tdArr[idx++] = '<td data-field="' + column.field + '"';
            tdArr[idx++] = ' class="' + classes.join(' ') + '"';
            tdArr[idx++] = '>';
            tdArr[idx++] = row[column.field];
            tdArr[idx++] = '</td>';
          }
          $(tr).append(tdArr.join(''));
          $(tableBody).append(tr);
        });
        if (datatable.dataSet.length === 0) {
          $('<span/>').
              addClass('m-datatable--error').
              width('100%').
              html(API.getOption('translate.records.noRecords')).
              appendTo(tableBody);
          $(datatable.wrap).addClass('m-datatable--error');
        }
        $(datatable.tableBody).replaceWith(tableBody);
        datatable.tableBody = tableBody;
        dt.setupDOM(datatable.table);
        dt.setupCellField([datatable.tableBody]);
        dt.setupTemplateCell(datatable.tableBody);
        dt.layoutUpdate();
      },
      updateTableComponents: function() {
        datatable.tableHead = $(datatable.table).children('thead');
        datatable.tableBody = $(datatable.table).children('tbody');
        datatable.tableFoot = $(datatable.table).children('tfoot');
      },
      getData: function() {
        var params = {
          dataType: 'json',
          method: 'GET',
          data: {},
          timeout: 30000,
        };
        if (options.data.type === 'local') {
          params.url = options.data.source;
        }
        if (options.data.type === 'remote') {
          params.url = API.getOption('data.source.read.url');
          if (typeof params.url !== 'string') params.url = API.getOption(
              'data.source.read');
          if (typeof params.url !== 'string') params.url = API.getOption(
              'data.source');
          params.headers = API.getOption('data.source.read.headers');
          params.data['datatable'] = API.getDataSourceParam();
          params.method = API.getOption('data.source.read.method') || 'POST';
          if (!API.getOption('data.serverPaging')) {
            delete params.data['datatable']['pagination'];
          }
          if (!API.getOption('data.serverSorting')) {
            delete params.data['datatable']['sort'];
          }
        }
        return $.ajax(params).done(function(data, textStatus, jqXHR) {
          datatable.dataSet = datatable.originalDataSet
              = dt.dataMapCallback(data);
          $(datatable).
              trigger('m-datatable--on-ajax-done', [datatable.dataSet]);
        }).fail(function(jqXHR, textStatus, errorThrown) {
          $(datatable).trigger('m-datatable--on-ajax-fail', [jqXHR]);
          $('<span/>').
              addClass('m-datatable--error').
              width('100%').
              html(API.getOption('translate.records.noRecords')).
              appendTo(datatable.tableBody);
          $(datatable).addClass('m-datatable--error');
        }).always(function() {
        });
      },
      paging: function(meta, callback) {
        var pg = {
          meta: null,
          pager: null,
          paginateEvent: null,
          pagerLayout: {pagination: null, info: null},
          callback: null,
          init: function(meta) {
            pg.meta = meta;
            pg.meta.pages = Math.max(Math.ceil(pg.meta.total / pg.meta.perpage),
                1);
            if (pg.meta.page > pg.meta.pages) pg.meta.page = pg.meta.pages;
            pg.paginateEvent = dt.getTablePrefix();
            pg.pager = $(datatable.table).siblings('.m-datatable__pager');
            if ($(pg.pager).hasClass('m-datatable--paging-loaded')) return;
            $(pg.pager).remove();
            if (pg.meta.pages === 0) return;
            API.setDataSourceParam('pagination', pg.meta);
            pg.callback = pg.serverCallback;
            if (typeof callback === 'function') pg.callback = callback;
            pg.addPaginateEvent();
            pg.populate();
            pg.meta.page = Math.max(pg.meta.page || 1, pg.meta.page);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.pagingBreakpoint.call();
            $(window).resize(pg.pagingBreakpoint);
          },
          serverCallback: function(ctx, meta) {
            dt.dataRender();
          },
          populate: function() {
            var icons = API.getOption('layout.icons.pagination');
            var title = API.getOption(
                'translate.toolbar.pagination.items.default');
            pg.pager = $('<div/>').
                addClass(
                    'm-datatable__pager m-datatable--paging-loaded clearfix');
            var pagerNumber = $('<ul/>').addClass('m-datatable__pager-nav');
            pg.pagerLayout['pagination'] = pagerNumber;
            $('<li/>').
                append($('<a/>').
                    attr('title', title.first).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--first').
                    append($('<i/>').addClass(icons.first)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', 1)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.prev).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--prev').
                    append($('<i/>').addClass(icons.prev)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.more).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--more-prev').
                    html($('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<input/>').
                    attr('type', 'text').
                    addClass('m-pager-input form-control').
                    attr('title', title.input).
                    on('keyup', function() {
                      $(this).attr('data-page', Math.abs($(this).val()));
                    }).
                    on('keypress', function(e) {
                      if (e.which === 13) pg.gotoMorePage(e);
                    })).
                appendTo(pagerNumber);
            var pagesNumber = API.getOption(
                'toolbar.items.pagination.pages.desktop.pagesNumber');
            var end = Math.ceil(pg.meta.page / pagesNumber) * pagesNumber;
            var start = end - pagesNumber;
            if (end > pg.meta.pages) {
              end = pg.meta.pages;
            }
            for (var x = start; x < end; x++) {
              var pageNumber = x + 1;
              $('<li/>').
                  append($('<a/>').
                      addClass(
                          'm-datatable__pager-link m-datatable__pager-link-number').
                      text(pageNumber).
                      attr('data-page', pageNumber).
                      attr('title', pageNumber).
                      on('click', pg.gotoPage)).
                  appendTo(pagerNumber);
            }
            $('<li/>').
                append($('<a/>').
                    attr('title', title.more).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--more-next').
                    html($('<i/>').addClass(icons.more)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.next).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--next').
                    append($('<i/>').addClass(icons.next)).
                    on('click', pg.gotoMorePage)).
                appendTo(pagerNumber);
            $('<li/>').
                append($('<a/>').
                    attr('title', title.last).
                    addClass(
                        'm-datatable__pager-link m-datatable__pager-link--last').
                    append($('<i/>').addClass(icons.last)).
                    on('click', pg.gotoMorePage).
                    attr('data-page', pg.meta.pages)).
                appendTo(pagerNumber);
            if (API.getOption('toolbar.items.info')) {
              pg.pagerLayout['info'] = $('<div/>').
                  addClass('m-datatable__pager-info').
                  append($('<span/>').addClass('m-datatable__pager-detail'));
            }
            $.each(API.getOption('toolbar.layout'), function(i, layout) {
              $(pg.pagerLayout[layout]).appendTo(pg.pager);
            });
            var pageSizeSelect = $('<select/>').
                addClass('selectpicker m-datatable__pager-size').
                attr('title', API.getOption(
                    'translate.toolbar.pagination.items.default.select')).
                attr('data-width', '70px').
                val(pg.meta.perpage).
                on('change', pg.updatePerpage).
                prependTo(pg.pagerLayout['info']);
            $.each(API.getOption('toolbar.items.pagination.pageSizeSelect'),
                function(i, size) {
                  var display = size;
                  if (size === -1) display = 'All';
                  $('<option/>').
                      attr('value', size).
                      html(display).
                      appendTo(pageSizeSelect);
                });
            $(datatable).ready(function() {
              $('.selectpicker').
                  selectpicker().
                  siblings('.dropdown-toggle').
                  attr('title', API.getOption(
                      'translate.toolbar.pagination.items.default.select'));
            });
            pg.paste();
          },
          paste: function() {
            $.each($.unique(API.getOption('toolbar.placement')),
                function(i, position) {
                  if (position === 'bottom') {
                    $(pg.pager).clone(true).insertAfter(datatable.table);
                  }
                  if (position === 'top') {
                    $(pg.pager).
                        clone(true).
                        addClass('m-datatable__pager--top').
                        insertBefore(datatable.table);
                  }
                });
          },
          gotoMorePage: function(e) {
            e.preventDefault();
            if ($(this).attr('disabled') === 'disabled') return false;
            var page = $(this).attr('data-page');
            if (typeof page === 'undefined') {
              page = $(e.target).attr('data-page');
            }
            pg.openPage(parseInt(page));
            return false;
          },
          gotoPage: function(e) {
            e.preventDefault();
            if ($(this).hasClass('m-datatable__pager-link--active')) return;
            pg.openPage(parseInt($(this).data('page')));
          },
          openPage: function(page) {
            pg.meta.page = parseInt(page);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);
            $(pg.pager).trigger('m-datatable--on-goto-page', pg.meta);
          },
          updatePerpage: function(e) {
            e.preventDefault();
            if (API.getOption('layout.height') === null) {
              $('html, body').animate({scrollTop: $(datatable).position().top});
            }
            pg.pager = $(datatable.table).
                siblings('.m-datatable__pager').
                removeClass('m-datatable--paging-loaded');
            if (e.originalEvent) {
              pg.meta.perpage = parseInt($(this).val());
            }
            $(pg.pager).
                find('select.m-datatable__pager-size').
                val(pg.meta.perpage).
                attr('data-selected', pg.meta.perpage);
            API.setDataSourceParam('pagination', pg.meta);
            $(pg.pager).trigger('m-datatable--on-update-perpage', pg.meta);
            $(datatable).trigger(pg.paginateEvent, pg.meta);
            pg.callback(pg, pg.meta);
            pg.updateInfo.call();
          },
          addPaginateEvent: function(e) {
            $(datatable).
                off(pg.paginateEvent).
                on(pg.paginateEvent, function(e, meta) {
                  dt.spinnerCallback(true);
                  pg.pager = $(datatable.table).siblings('.m-datatable__pager');
                  var pagerNumber = $(pg.pager).find('.m-datatable__pager-nav');
                  $(pagerNumber).
                      find('.m-datatable__pager-link--active').
                      removeClass('m-datatable__pager-link--active');
                  $(pagerNumber).
                      find('.m-datatable__pager-link-number[data-page="' +
                          meta.page + '"]').
                      addClass('m-datatable__pager-link--active');
                  $(pagerNumber).
                      find('.m-datatable__pager-link--prev').
                      attr('data-page', Math.max(meta.page - 1, 1));
                  $(pagerNumber).
                      find('.m-datatable__pager-link--next').
                      attr('data-page', Math.min(meta.page + 1, meta.pages));
                  $(pg.pager).each(function() {
                    $(this).
                        find('.m-pager-input[type="text"]').
                        prop('value', meta.page);
                  });
                  $(pg.pager).find('.m-datatable__pager-nav').show();
                  if (meta.pages <= 1) {
                    $(pg.pager).find('.m-datatable__pager-nav').hide();
                  }
                  API.setDataSourceParam('pagination', pg.meta);
                  $(pg.pager).
                      find('select.m-datatable__pager-size').
                      val(meta.perpage).
                      attr('data-selected', meta.perpage);
                  $(datatable.table).
                      find('.m-checkbox > [type="checkbox"]').
                      prop('checked', false);
                  $(datatable.table).
                      find('.m-datatable__row--active').
                      removeClass('m-datatable__row--active');
                  pg.updateInfo.call();
                  pg.pagingBreakpoint.call();
                });
          },
          updateInfo: function() {
            var start = Math.max(pg.meta.perpage * (pg.meta.page - 1) + 1, 1);
            var end = Math.min(start + pg.meta.perpage - 1, pg.meta.total);
            $(pg.pager).
                find('.m-datatable__pager-info').
                find('.m-datatable__pager-detail').
                html(dt.dataPlaceholder(
                    API.getOption('translate.toolbar.pagination.items.info'), {
                      start: start,
                      end: pg.meta.perpage === -1 ? pg.meta.total : end,
                      pageSize: pg.meta.perpage === -1 ||
                      pg.meta.perpage >= pg.meta.total
                          ? pg.meta.total
                          : pg.meta.perpage,
                      total: pg.meta.total,
                    }));
          },
          pagingBreakpoint: function() {
            var pagerNumber = $(datatable.table).
                siblings('.m-datatable__pager').
                find('.m-datatable__pager-nav');
            if ($(pagerNumber).length === 0) return;
            var currentPage = API.getCurrentPage();
            var pagerInput = $(pagerNumber).
                find('.m-pager-input').
                closest('li');
            $(pagerNumber).find('li').show();
            $.each(API.getOption('toolbar.items.pagination.pages'),
                function(mode, option) {
                  if (mUtil.isInResponsiveRange(mode)) {
                    switch (mode) {
                      case 'desktop':
                      case 'tablet':
                        var end = Math.ceil(currentPage / option.pagesNumber) *
                            option.pagesNumber;
                        var start = end - option.pagesNumber;
                        $(pagerInput).hide();
                        pg.meta = API.getDataSourceParam('pagination');
                        pg.paginationUpdate();
                        break;
                      case 'mobile':
                        $(pagerInput).show();
                        $(pagerNumber).
                            find('.m-datatable__pager-link--more-prev').
                            closest('li').
                            hide();
                        $(pagerNumber).
                            find('.m-datatable__pager-link--more-next').
                            closest('li').
                            hide();
                        $(pagerNumber).
                            find('.m-datatable__pager-link-number').
                            closest('li').
                            hide();
                        break;
                    }
                    return false;
                  }
                });
          },
          paginationUpdate: function() {
            var pager = $(datatable.table).
                    siblings('.m-datatable__pager').
                    find('.m-datatable__pager-nav'),
                pagerMorePrev = $(pager).
                    find('.m-datatable__pager-link--more-prev'),
                pagerMoreNext = $(pager).
                    find('.m-datatable__pager-link--more-next'),
                pagerFirst = $(pager).find('.m-datatable__pager-link--first'),
                pagerPrev = $(pager).find('.m-datatable__pager-link--prev'),
                pagerNext = $(pager).find('.m-datatable__pager-link--next'),
                pagerLast = $(pager).find('.m-datatable__pager-link--last');
            var pagerNumber = $(pager).find('.m-datatable__pager-link-number');
            var morePrevPage = Math.max($(pagerNumber).first().data('page') - 1,
                1);
            $(pagerMorePrev).each(function(i, prev) {
              $(prev).attr('data-page', morePrevPage);
            });
            if (morePrevPage === 1) {
              $(pagerMorePrev).parent().hide();
            } else {
              $(pagerMorePrev).parent().show();
            }
            var moreNextPage = Math.min($(pagerNumber).last().data('page') + 1,
                pg.meta.pages);
            $(pagerMoreNext).each(function(i, prev) {
              $(pagerMoreNext).attr('data-page', moreNextPage).show();
            });
            if (moreNextPage === pg.meta.pages
                && moreNextPage === $(pagerNumber).last().data('page')) {
              $(pagerMoreNext).parent().hide();
            } else {
              $(pagerMoreNext).parent().show();
            }
            if (pg.meta.page === 1) {
              $(pagerFirst).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
              $(pagerPrev).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
            } else {
              $(pagerFirst).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
              $(pagerPrev).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
            }
            if (pg.meta.page === pg.meta.pages) {
              $(pagerNext).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
              $(pagerLast).
                  attr('disabled', true).
                  addClass('m-datatable__pager-link--disabled');
            } else {
              $(pagerNext).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
              $(pagerLast).
                  removeAttr('disabled').
                  removeClass('m-datatable__pager-link--disabled');
            }
            var nav = API.getOption('toolbar.items.pagination.navigation');
            if (!nav.first) $(pagerFirst).remove();
            if (!nav.prev) $(pagerPrev).remove();
            if (!nav.next) $(pagerNext).remove();
            if (!nav.last) $(pagerLast).remove();
          },
        };
        pg.init(meta);
        return pg;
      },
      columnHide: function() {
        var screen = mUtil.getViewPort().width;
        $.each(options.columns, function(i, column) {
          if (typeof column.responsive !== 'undefined') {
            var field = column.field;
            var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
              return field === $(n).data('field');
            });
            if (mUtil.getBreakpoint(column.responsive.hidden) >= screen) {
              $(tds).hide();
            } else {
              $(tds).show();
            }
            if (mUtil.getBreakpoint(column.responsive.visible) <= screen) {
              $(tds).show();
            } else {
              $(tds).hide();
            }
          }
        });
      },
      setupSubDatatable: function() {
        var detailCallback = API.getOption('detail.content');
        if (typeof detailCallback === 'function') {
          if ($(datatable.table).find('.m-datatable__detail').length >
              0) return;
          $(datatable.wrap).addClass('m-datatable--subtable');
          options.columns[0]['subtable'] = true;
          var toggleSubTable = function(e) {
            e.preventDefault();
            var parentRow = $(this).closest('.m-datatable__row');
            var detailRow = $(parentRow).next().toggle();
            var primaryKey = $(this).
                closest('[data-field]:first-child').
                find('.m-datatable__toggle-subtable').
                data('value');
            var icon = $(this).find('i').removeAttr('class');
            if ($(detailRow).is(':hidden')) {
              $(icon).
                  addClass(API.getOption('layout.icons.rowDetail.collapse'));
              $(parentRow).removeClass('m-datatable__row--detail-expanded');
              $(datatable).
                  trigger('m-datatable--on-collapse-detail', [parentRow]);
            } else {
              $(icon).addClass(API.getOption('layout.icons.rowDetail.expand'));
              $(parentRow).addClass('m-datatable__row--detail-expanded');
              $(datatable).
                  trigger('m-datatable--on-expand-detail', [parentRow]);
              $.map(datatable.dataSet, function(n, i) {
                if (primaryKey === n[options.columns[0].field]) {
                  e.data = n;
                  return true;
                }
                return false;
              });
              e.detailCell = $(detailRow).find('.m-datatable__detail');
              if ($(e.detailCell).find('.m-datatable').length === 0) {
                detailCallback(e);
              }
            }
          };
          var columns = options.columns;
          $(datatable.tableBody).
              find('.m-datatable__row').
              each(function(tri, tr) {
                $(tr).find('.m-datatable__cell').each(function(tdi, td) {
                  var column = $.grep(columns, function(n, i) {
                    return $(td).data('field') === n.field;
                  })[0];
                  if (typeof column !== 'undefined') {
                    var value = $(td).text();
                    if (typeof column.subtable !== 'undefined' &&
                        column.subtable) {
                      if ($(td).find('.m-datatable__toggle-subtable').length >
                          0) return;
                      $(td).
                          children().
                          html($('<a/>').
                              addClass('m-datatable__toggle-subtable').
                              attr('href', '#').
                              attr('data-value', value).
                              attr('title', API.getOption('detail.title')).
                              on('click', toggleSubTable).
                              append($('<i/>').
                                  addClass(API.getOption(
                                      'layout.icons.rowDetail.collapse'))));
                    }
                  }
                });
              });
          $(datatable.tableBody).find('.m-datatable__row').each(function() {
            var detailRow = $('<tr/>').
                addClass('m-datatable__row-detail').
                hide().
                append($('<td/>').
                    addClass('m-datatable__detail').
                    attr('colspan', dt.getTotalColumns()));
            $(this).after(detailRow);
            if ($(this).hasClass('m-datatable__row--even')) {
              $(detailRow).addClass('m-datatable__row-detail--even');
            }
          });
        }
      },
      dataMapCallback: function(raw) {
        var dataSet = raw;
        if (typeof API.getOption('data.source.read.map') === 'function') {
          return API.getOption('data.source.read.map')(raw);
        } else {
          if (typeof raw.data !== 'undefined') {
            dataSet = raw.data;
          }
        }
        return dataSet;
      },
      isSpinning: false,
      spinnerCallback: function(block) {
        if (block) {
          if (!dt.isSpinning) {
            var spinnerOptions = API.getOption('layout.spinner');
            if (spinnerOptions.message === true) {
              spinnerOptions.message = API.getOption(
                  'translate.records.processing');
            }
            dt.isSpinning = true;
            if (typeof mApp !== 'undefined') {
              mApp.block(datatable, spinnerOptions);
            }
          }
        } else {
          dt.isSpinning = false;
          if (typeof mApp !== 'undefined') {
            mApp.unblock(datatable);
          }
        }
      },
      sortCallback: function(data, sort, column) {
        var type = column['type'] || 'string';
        var format = column['format'] || '';
        var field = column['field'];
        if (type === 'date' && typeof moment === 'undefined') {
          throw new Error('Moment.js is required.');
        }
        return $(data).sort(function(a, b) {
          var aField = a[field];
          var bField = b[field];
          switch (type) {
            case 'date':
              var diff = moment(aField, format).diff(moment(bField, format));
              if (sort === 'asc') {
                return diff > 0 ? 1 : diff < 0 ? -1 : 0;
              } else {
                return diff < 0 ? 1 : diff > 0 ? -1 : 0;
              }
              break;
            case 'number':
              if (isNaN(parseFloat(aField)) && aField != null) {
                aField = Number(aField.replace(/[^0-9\.-]+/g, ''));
              }
              if (isNaN(parseFloat(bField)) && bField != null) {
                bField = Number(bField.replace(/[^0-9\.-]+/g, ''));
              }
              aField = parseFloat(aField);
              bField = parseFloat(bField);
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;
            case 'string':
            default:
              if (sort === 'asc') {
                return aField > bField ? 1 : aField < bField ? -1 : 0;
              } else {
                return aField < bField ? 1 : aField > bField ? -1 : 0;
              }
              break;
          }
        });
      },
      log: function(text, obj) {
        if (typeof obj === 'undefined') obj = '';
        if (datatable.debug) {
          console.log(text, obj);
        }
      },
      isLocked: function() {
        return $(datatable.wrap).hasClass('m-datatable--lock') || false;
      },
      replaceTableContent: function(html, tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        if ($(tablePart).hasClass('mCustomScrollbar')) {
          $(tablePart).find('.mCSB_container').html(html);
        } else {
          $(tablePart).html(html);
        }
      },
      getExtraSpace: function(element) {
        var padding = parseInt($(element).css('paddingRight')) +
            parseInt($(element).css('paddingLeft'));
        var margin = parseInt($(element).css('marginRight')) +
            parseInt($(element).css('marginLeft'));
        var border = Math.ceil(
            $(element).css('border-right-width').replace('px', ''));
        return padding + margin + border;
      },
      dataPlaceholder: function(template, data) {
        var result = template;
        $.each(data, function(key, val) {
          result = result.replace('{{' + key + '}}', val);
        });
        return result;
      },
      getTableId: function(suffix) {
        if (typeof suffix === 'undefined') suffix = '';
        return $(datatable).attr('id') + suffix;
      },
      getTablePrefix: function(suffix) {
        if (typeof suffix !== 'undefined') suffix = '-' + suffix;
        return 'm-datatable__' + dt.getTableId() + '-' + dt.getDepth() + suffix;
      },
      getDepth: function() {
        var depth = 0;
        var table = datatable.table;
        do {
          table = $(table).parents('.m-datatable__table');
          depth++;
        } while ($(table).length > 0);
        return depth;
      },
      stateKeep: function(key, value) {
        key = dt.getTablePrefix(key);
        if (API.getOption('data.saveState') === false) return;
        if (API.getOption('data.saveState.webstorage') && localStorage) {
          localStorage.setItem(key, JSON.stringify(value));
        }
        if (API.getOption('data.saveState.cookie')) {
          Cookies.set(key, JSON.stringify(value));
        }
      },
      stateGet: function(key, defValue) {
        key = dt.getTablePrefix(key);
        if (API.getOption('data.saveState') === false) return;
        var value = null;
        if (API.getOption('data.saveState.webstorage') && localStorage) {
          value = localStorage.getItem(key);
        } else {
          value = Cookies.get(key);
        }
        if (typeof value !== 'undefined' && value !== null) {
          return JSON.parse(value);
        }
      },
      stateUpdate: function(key, value) {
        var ori = dt.stateGet(key);
        if (typeof ori === 'undefined' || ori === null) ori = {};
        dt.stateKeep(key, $.extend({}, ori, value));
      },
      stateRemove: function(key) {
        key = dt.getTablePrefix(key);
        if (localStorage) {
          localStorage.removeItem(key);
        }
        Cookies.remove(key);
      },
      getTotalColumns: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        return $(tablePart).
            find('.m-datatable__row').
            first().
            find('.m-datatable__cell').length;
      },
      getTotalRows: function(tablePart) {
        if (typeof tablePart === 'undefined') tablePart = datatable.tableBody;
        return $(tablePart).
            find('.m-datatable__row').
            first().
            parent().
            find('.m-datatable__row').length;
      },
      getOneRow: function(tablePart, row, tdOnly) {
        if (typeof tdOnly === 'undefined') tdOnly = true;
        var result = $(tablePart).
            find('.m-datatable__row:not(.m-datatable__row-detail):nth-child(' +
                row + ')');
        if (tdOnly) {
          result = result.find('.m-datatable__cell');
        }
        return result;
      },
      hasOverflowCells: function(element) {
        var children = $(element).
            find('tr:first-child').
            find('.m-datatable__cell');
        var maxWidth = 0;
        if (children.length > 0) {
          $(children).each(function(tdi, td) {
            maxWidth += Math.ceil($(td).innerWidth());
          });
          return maxWidth >= $(element).outerWidth();
        }
        return false;
      },
      hasOverflowX: function(element) {
        var children = $(element).find('*');
        if (children.length > 0) {
          var maxWidth = Math.max.apply(null, $(children).map(function() {
            return $(this).outerWidth(true);
          }).get());
          return maxWidth > $(element).width();
        }
        return false;
      },
      hasOverflowY: function(element) {
        var children = $(element).find('.m-datatable__row');
        var maxHeight = 0;
        if (children.length > 0) {
          $(children).each(function(tdi, td) {
            maxHeight += Math.floor($(td).innerHeight());
          });
          return maxHeight > $(element).innerHeight();
        }
        return false;
      },
      sortColumn: function(header, sort, int) {
        if (typeof sort === 'undefined') sort = 'asc'; 
        if (typeof int === 'undefined') int = false;
        var column = $(header).index();
        var rows = $(datatable.tableBody).find('.m-datatable__row');
        var hIndex = $(header).closest('.m-datatable__lock').index();
        if (hIndex !== -1) {
          rows = $(datatable.tableBody).
              find('.m-datatable__lock:nth-child(' + (hIndex + 1) + ')').
              find('.m-datatable__row');
        }
        var container = $(rows).parent();
        $(rows).sort(function(a, b) {
          var tda = $(a).find('td:nth-child(' + column + ')').text();
          var tdb = $(b).find('td:nth-child(' + column + ')').text();
          if (int) {
            tda = parseInt(tda);
            tdb = parseInt(tdb);
          }
          if (sort === 'asc') {
            return tda > tdb ? 1 : tda < tdb ? -1 : 0;
          } else {
            return tda < tdb ? 1 : tda > tdb ? -1 : 0;
          }
        }).appendTo(container);
      },
      sorting: function() {
        var sortObj = {
          init: function() {
            if (options.sortable) {
              $(datatable.tableHead).
                  find('.m-datatable__cell:not(.m-datatable__cell--check)').
                  addClass('m-datatable__cell--sort').
                  off('click').
                  on('click', sortObj.sortClick);
              sortObj.setIcon();
            }
          },
          setIcon: function() {
            var meta = API.getDataSourceParam('sort');
            var td = $(datatable.tableHead).
                find('.m-datatable__cell[data-field="' + meta.field + '"]').
                attr('data-sort', meta.sort);
            var sorting = $(td).find('span');
            var icon = $(sorting).find('i');
            var icons = API.getOption('layout.icons.sort');
            if ($(icon).length > 0) {
              $(icon).removeAttr('class').addClass(icons[meta.sort]);
            } else {
              $(sorting).append($('<i/>').addClass(icons[meta.sort]));
            }
          },
          sortClick: function(e) {
            var meta = API.getDataSourceParam('sort');
            var field = $(this).data('field');
            var column = dt.getColumnByField(field);
            if (typeof column.sortable !== 'undefined' &&
                column.sortable === false) return;
            $(datatable.tableHead).
                find('.m-datatable__cell > span > i').
                remove();
            if (options.sortable) {
              dt.spinnerCallback(true);
              var sort = 'desc';
              if (meta.field === field) {
                sort = meta.sort;
              }
              sort = typeof sort === 'undefined' || sort === 'desc'
                  ? 'asc'
                  : 'desc';
              meta = {field: field, sort: sort};
              API.setDataSourceParam('sort', meta);
              sortObj.setIcon();
              setTimeout(function() {
                dt.dataRender('sort');
                $(datatable).trigger('m-datatable--on-sort', meta);
              }, 300);
            }
          },
        };
        sortObj.init();
      },
      localDataUpdate: function() {
        var params = API.getDataSourceParam();
        if (typeof datatable.originalDataSet === 'undefined') {
          datatable.originalDataSet = datatable.dataSet;
        }
        var field = params.sort.field;
        var sort = params.sort.sort;
        var column = dt.getColumnByField(field);
        if (typeof column !== 'undefined') {
          if (typeof column.sortCallback === 'function') {
            datatable.dataSet = column.sortCallback(datatable.originalDataSet,
                sort, column);
          } else {
            datatable.dataSet = dt.sortCallback(datatable.originalDataSet, sort,
                column);
          }
        } else {
          datatable.dataSet = datatable.originalDataSet;
        }
        if (typeof params.query === 'object') {
          params.query = params.query || {};
          var search = $(API.getOption('search.input')).val();
          if (typeof search !== 'undefined' && search !== '') {
            search = search.toLowerCase();
            datatable.dataSet = $.grep(datatable.dataSet, function(obj) {
              for (var field in obj) {
                if (!obj.hasOwnProperty(field)) continue;
                if (typeof obj[field] === 'string') {
                  if (obj[field].toLowerCase().indexOf(search) > -1) {
                    return true;
                  }
                }
              }
              return false;
            });
            delete params.query[dt.getGeneralSearchKey()];
          }
          $.each(params.query, function(k, v) {
            if (v === '') {
              delete params.query[k];
            }
          });
          datatable.dataSet = dt.filterArray(datatable.dataSet, params.query);
          datatable.dataSet = datatable.dataSet.filter(function() {
            return true;
          });
        }
        return datatable.dataSet;
      },
      filterArray: function(list, args, operator) {
        if (typeof list !== 'object') {
          return [];
        }
        if (typeof operator === 'undefined') operator = 'AND';
        if (typeof args !== 'object') {
          return list;
        }
        operator = operator.toUpperCase();
        if ($.inArray(operator, ['AND', 'OR', 'NOT']) === -1) {
          return [];
        }
        var count = Object.keys(args).length;
        var filtered = [];
        $.each(list, function(key, obj) {
          var to_match = obj;
          var matched = 0;
          $.each(args, function(m_key, m_value) {
            if (to_match.hasOwnProperty(m_key) && m_value == to_match[m_key]) {
              matched++;
            }
          });
          if (( 'AND' == operator && matched == count ) ||
              ( 'OR' == operator && matched > 0 ) ||
              ( 'NOT' == operator && 0 == matched )) {
            filtered[key] = obj;
          }
        });
        list = filtered;
        return list;
      },
      resetScroll: function() {
        if (typeof options.detail === 'undefined' && dt.getDepth() === 1) {
          $(datatable.table).find('.m-datatable__row').css('left', 0);
          $(datatable.table).find('.m-datatable__lock').css('top', 0);
          $(datatable.tableBody).scrollTop(0);
        }
      },
      getColumnByField: function(field) {
        var result;
        $.each(options.columns, function(i, column) {
          if (field === column.field) {
            result = column;
            return false;
          }
        });
        return result;
      },
      getDefaultSortColumn: function() {
        var result = {sort: '', field: ''};
        $.each(options.columns, function(i, column) {
          if (typeof column.sortable !== 'undefined'
              && $.inArray(column.sortable, ['asc', 'desc']) !== -1) {
            result = {sort: column.sortable, field: column.field};
            return false;
          }
        });
        return result;
      },
      getHiddenDimensions: function(element, includeMargin) {
        var props = {
              position: 'absolute',
              visibility: 'hidden',
              display: 'block',
            },
            dim = {
              width: 0,
              height: 0,
              innerWidth: 0,
              innerHeight: 0,
              outerWidth: 0,
              outerHeight: 0,
            },
            hiddenParents = $(element).parents().addBack().not(':visible');
        includeMargin = (typeof includeMargin === 'boolean')
            ? includeMargin
            : false;
        var oldProps = [];
        hiddenParents.each(function() {
          var old = {};
          for (var name in props) {
            old[name] = this.style[name];
            this.style[name] = props[name];
          }
          oldProps.push(old);
        });
        dim.width = $(element).width();
        dim.outerWidth = $(element).outerWidth(includeMargin);
        dim.innerWidth = $(element).innerWidth();
        dim.height = $(element).height();
        dim.innerHeight = $(element).innerHeight();
        dim.outerHeight = $(element).outerHeight(includeMargin);
        hiddenParents.each(function(i) {
          var old = oldProps[i];
          for (var name in props) {
            this.style[name] = old[name];
          }
        });
        return dim;
      },
      getGeneralSearchKey: function() {
        var searchInput = $(API.getOption('search.input'));
        return $(searchInput).prop('name') || $(searchInput).prop('id');
      },
      getObject: function(path, object) {
        return path.split('.').reduce(function(obj, i) {
          return obj !== null && typeof obj[i] !== 'undefined' ? obj[i] : null;
        }, object);
      },
      extendObj: function(obj, path, value) {
        var levels = path.split('.'),
            i = 0;
        function createLevel(child) {
          var name = levels[i++];
          if (typeof child[name] !== 'undefined' && child[name] !== null) {
            if (typeof child[name] !== 'object' &&
                typeof child[name] !== 'function') {
              child[name] = {};
            }
          } else {
            child[name] = {};
          }
          if (i === levels.length) {
            child[name] = value;
          } else {
            createLevel(child[name]);
          }
        }
        createLevel(obj);
        return obj;
      },
    };
    this.API = {
      row: null,
      record: null,
      column: null,
      value: null,
      params: null,
    };
    var API = {
      timer: 0,
      redraw: function() {
        dt.adjustCellsWidth.call();
        dt.adjustCellsHeight.call();
        dt.adjustLockContainer.call();
        dt.initHeight.call();
        return datatable;
      },
      load: function() {
        API.reload();
        return datatable;
      },
      reload: function() {
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(API.timer);
            API.timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          if (options.data.serverFiltering === false) {
            dt.localDataUpdate();
          }
          dt.dataRender();
          $(datatable).trigger('m-datatable--on-reloaded');
        }, API.getOption('search.delay'));
        return datatable;
      },
      getRecord: function(id) {
        if (typeof datatable.tableBody === 'undefined') datatable.tableBody = $(
            datatable.table).children('tbody');
        $(datatable.tableBody).
            find('.m-datatable__cell:first-child').
            each(function(i, cell) {
              if (id == $(cell).text()) {
                datatable.API.row = $(cell).closest('.m-datatable__row');
                var rowNumber = datatable.API.row.index() + 1;
                datatable.API.record = datatable.API.value = dt.getOneRow(
                    datatable.tableBody, rowNumber);
                return datatable;
              }
            });
        return datatable;
      },
      getColumn: function(columnName) {
        datatable.API.column = datatable.API.value = $(datatable.API.record).
            find('[data-field="' + columnName + '"]');
        return datatable;
      },
      destroy: function() {
        $(datatable).parent().find('.m-datatable__pager').remove();
        $(datatable).
            replaceWith(
                $(datatable.old).addClass('m-datatable--destroyed').show());
        $(datatable).trigger('m-datatable--on-destroy');
        return datatable;
      },
      sort: function(field, sort) {
        if (typeof sort === 'undefined') sort = 'asc';
        $(datatable.tableHead).
            find('.m-datatable__cell[data-field="' + field + '"]').
            trigger('click');
        return datatable;
      },
      getValue: function() {
        return $(datatable.API.value).text();
      },
      setActive: function(cell) {
        if (typeof cell === 'string') {
          cell = $(datatable.tableBody).
              find('.m-checkbox--single > [type="checkbox"][value="' + cell +
                  '"]');
        }
        $(cell).prop('checked', true);
        var row = $(cell).
            closest('.m-datatable__row').
            addClass('m-datatable__row--active');
        var index = $(row).index() + 1;
        $(row).
            closest('.m-datatable__lock').
            parent().
            find('.m-datatable__row:nth-child(' + index + ')').
            addClass('m-datatable__row--active');
        var ids = [];
        $(row).each(function(i, td) {
          var id = $(td).
              find(
                  '.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').
              val();
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });
        $(datatable).trigger('m-datatable--on-check', [ids]);
      },
      setInactive: function(cell) {
        if (typeof cell === 'string') {
          cell = $(datatable.tableBody).
              find('.m-checkbox--single > [type="checkbox"][value="' + cell +
                  '"]');
        }
        $(cell).prop('checked', false);
        var row = $(cell).
            closest('.m-datatable__row').
            removeClass('m-datatable__row--active');
        var index = $(row).index() + 1;
        $(row).
            closest('.m-datatable__lock').
            parent().
            find('.m-datatable__row:nth-child(' + index + ')').
            removeClass('m-datatable__row--active');
        var ids = [];
        $(row).each(function(i, td) {
          var id = $(td).
              find(
                  '.m-checkbox--single:not(.m-checkbox--all) > [type="checkbox"]').
              val();
          if (typeof id !== 'undefined') {
            ids.push(id);
          }
        });
        $(datatable).trigger('m-datatable--on-uncheck', [ids]);
      },
      setActiveAll: function(active) {
        if (active) {
          API.setActive($(datatable.table).
              find('.m-datatable__body .m-datatable__row').
              find('.m-datatable__cell'));
        } else {
          API.setInactive($(datatable.table).
              find('.m-datatable__body .m-datatable__row').
              find('.m-datatable__cell'));
        }
        $(datatable.table).
            find('.m-datatable__body .m-datatable__row').
            find('.m-checkbox [type="checkbox"]').
            prop('checked', active || false);
      },
      setSelectedRecords: function() {
        datatable.API.record = $(datatable.tableBody).
            find('.m-datatable__row--active');
        return datatable;
      },
      getSelectedRecords: function() {
        API.setSelectedRecords();
        return datatable.API.record;
      },
      getOption: function(path) {
        return dt.getObject(path, options);
      },
      setOption: function(path, object) {
        options = dt.extendObj(options, path, object);
      },
      search: function(value, columns) {
        if (typeof columns !== 'undefined') columns = $.makeArray(columns);
        var delay = (function() {
          return function(callback, ms) {
            clearTimeout(API.timer);
            API.timer = setTimeout(callback, ms);
          };
        })();
        delay(function() {
          var query = API.getDataSourceQuery();
          if (typeof columns === 'undefined' && typeof value !== 'undefined') {
            var key = dt.getGeneralSearchKey();
            query[key] = value;
          }
          if (typeof columns === 'object') {
            $.each(columns, function(k, column) {
              query[column] = value;
            });
            $.each(query, function(k, v) {
              if (v === '') {
                delete query[k];
              }
            });
          }
          API.setDataSourceQuery(query);
          if (options.data.serverFiltering === false) {
            dt.localDataUpdate();
          }
          dt.dataRender();
        }, API.getOption('search.delay'));
      },
      setDataSourceParam: function(param, value) {
        var defaultSort = dt.getDefaultSortColumn();
        datatable.API.params = $.extend({}, {
          pagination: {page: 1, perpage: API.getOption('data.pageSize')},
          sort: {sort: defaultSort.sort, field: defaultSort.field},
          query: {},
        }, datatable.API.params, dt.stateGet(dt.stateId));
        datatable.API.params = dt.extendObj(datatable.API.params, param, value);
        dt.stateKeep(dt.stateId, datatable.API.params);
      },
      getDataSourceParam: function(param) {
        var defaultSort = dt.getDefaultSortColumn();
        datatable.API.params = $.extend({}, {
          pagination: {page: 1, perpage: API.getOption('data.pageSize')},
          sort: {sort: defaultSort.sort, field: defaultSort.field},
          query: {},
        }, datatable.API.params, dt.stateGet(dt.stateId));
        if (typeof param === 'string') {
          return dt.getObject(param, datatable.API.params);
        }
        return datatable.API.params;
      },
      getDataSourceQuery: function() {
        return API.getDataSourceParam('query') || {};
      },
      setDataSourceQuery: function(query) {
        API.setDataSourceParam('query', query);
      },
      getCurrentPage: function() {
        return $(datatable.table).
            siblings('.m-datatable__pager').
            last().
            find('.m-datatable__pager-nav').
            find('.m-datatable__pager-link.m-datatable__pager-link--active').
            data('page') || 1;
      },
      getPageSize: function() {
        return $(datatable.table).
            siblings('.m-datatable__pager').
            last().
            find('.m-datatable__pager-size').
            val() || 10;
      },
      getTotalRows: function() {
        return datatable.API.params.pagination.total;
      },
      getDataSet: function() {
        return datatable.originalDataSet;
      },
      hideColumn: function(fieldName) {
        $.map(options.columns, function(column) {
          if (fieldName === column.field) {
            column.responsive = {hidden: 'xl'};
          }
          return column;
        });
        var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
          return fieldName === $(n).data('field');
        });
        $(tds).hide();
      },
      showColumn: function(fieldName) {
        $.map(options.columns, function(column) {
          if (fieldName === column.field) {
            delete column.responsive;
          }
          return column;
        });
        var tds = $.grep($(datatable.table).find('.m-datatable__cell'), function(n, i) {
          return fieldName === $(n).data('field');
        });
        $(tds).show();
      },
    };
    $.each(API, function(funcName, func) {
      datatable[funcName] = func;
    });
    if (typeof options === 'string') {
      API[options].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof options === 'object' || !options) {
      datatable.textAlign = {
        left: 'm-datatable__cell--left',
        center: 'm-datatable__cell--center',
        right: 'm-datatable__cell--right',
      };
      datatable.dataSet = null;
      options = $.extend(true, {}, $.fn.mDatatable.defaults, options);
      $(datatable).data('options', options);
      $(datatable).trigger('m-datatable--on-init', options);
      dt.init.apply(this, [options]);
    } else {
      $.error('Method ' + options + ' does not exist');
    }
    return datatable;
  };
  $.fn.mDatatable.defaults = {
    data: {
      type: 'local',
      source: null,
      pageSize: 10, 
      saveState: {
        cookie: true,
        webstorage: true,
      }, 
      serverPaging: false,
      serverFiltering: false,
      serverSorting: false,
    },
    layout: {
      theme: 'default', 
      class: 'm-datatable--brand', 
      scroll: false, 
      height: null, 
      footer: false, 
      header: true, 
      smoothScroll: {
        scrollbarShown: true,
      },
      spinner: {
        overlayColor: '#000000',
        opacity: 0,
        type: 'loader',
        state: 'brand',
        message: true,
      },
      icons: {
        sort: {asc: 'la la-arrow-up', desc: 'la la-arrow-down'},
        pagination: {
          next: 'la la-angle-right',
          prev: 'la la-angle-left',
          first: 'la la-angle-double-left',
          last: 'la la-angle-double-right',
          more: 'la la-ellipsis-h',
        },
        rowDetail: {expand: 'fa fa-caret-down', collapse: 'fa fa-caret-right'},
      },
    },
    sortable: true,
    resizable: false,
    filterable: false,
    pagination: true,
    editable: false,
    columns: [],
    search: {
      input: null,
      delay: 400,
    },
    rows: {},
    toolbar: {
      layout: ['pagination', 'info'],
      placement: ['bottom'],  
      items: {
        pagination: {
          type: 'default',
          pages: {
            desktop: {
              layout: 'default',
              pagesNumber: 6,
            },
            tablet: {
              layout: 'default',
              pagesNumber: 3,
            },
            mobile: {
              layout: 'compact',
            },
          },
          navigation: {
            prev: true, 
            next: true, 
            first: true, 
            last: true 
          },
          pageSizeSelect: [10, 20, 30, 50, 100] 
        },
        info: true,
      },
    },
    translate: {
      records: {
        processing: 'Please wait...',
        noRecords: 'No records found',
      },
      toolbar: {
        pagination: {
          items: {
            default: {
              first: 'First',
              prev: 'Previous',
              next: 'Next',
              last: 'Last',
              more: 'More pages',
              input: 'Page number',
              select: 'Select page size',
            },
            info: 'Displaying {{start}} - {{end}} of {{total}} records',
          },
        },
      },
    },
  };
}(jQuery));
