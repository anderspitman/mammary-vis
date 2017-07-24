(function() {
  "use strict";

    var root = document.body;

    var GenesList = {
        list: [],
        headers: [],
        fetch: function(){
            return m.request({
                method: "GET",
                url: "http://localhost:8080/metadata",
            })
            .then(function(genes) {
                GenesList.headers = genes.column_names,
                GenesList.list = genes.rows
            })
        }
    }

    var Gene = {
        controller: function() {
            return {id: m.route.param("item")};
        },
        view: function() {
            return ([
                m("nav.menu", [m("a[href='/']", {oncreate: m.mount.link},
                    "Genes list")]),
                m("h1","Gene report"), 
                m("div", m.route.param("data")+": "),
                m("p", "...gene report..."),
                ])
        }
    }

    var DataT = {
        oninit: GenesList.fetch,
        oncreate: function(vnode){
            $(vnode.dom).append('<div align="center"><a class="toggle-vis" col="0">Ensembl Gene</a> - <a class="toggle-vis" col="1">Ensembl Transcript</a> - <a class="toggle-vis" col="2">Display Name</a> - <a class="toggle-vis" col="3">Reason</a> - <a class="toggle-vis" col="4">Codemlid</a></div>');
            $(vnode.dom).append('<table id="genesTable" class="display"></table>');
            $('a.toggle-vis').on('click',function(e){
                console.log("e");
                //Get the column object
                var column = $('#genesTable').DataTable().column($(this).attr('col'));
                //Toggle visibility
                column.visible(!column.visible());
                });
        },
        onupdate: function(vnode){
            $('#genesTable').DataTable({
                data: GenesList.list,
                "iDisplayLength": 25,
                columnDefs: [
                    {
                        targets:"_all",
                        className:"dt-center"
                    },
                    {
                        targets: 0,
                        title:GenesList.headers[0],
                        render: function(data,type,row,meta){
                            return '<a href="#!/'+data+'" style="text-decoration: none"><div>'+data+'</div></a>';
                        }
                    },
                    {
                        targets: 1,
                        title:GenesList.headers[1]
                    },
                    {
                        targets: 2,
                        title:GenesList.headers[2]
                    },
                    {
                        targets: 3,
                        title:GenesList.headers[3]
                    },
                    {
                        targets:4,
                        title:GenesList.headers[4]
                    }
                ]
            });
        },
        view: function(){   
            return m("div", {class:"table_wraper"})
        }
    }

    m.route(root, "/",{
        "/": DataT,
        "/:data": Gene,
        });

}());