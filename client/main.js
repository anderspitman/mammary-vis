(function() {
  "use strict";

    var root = document.body;

    var GenesList = {
        list: [],
        fetch: function(){
            return m.request({
                method: "GET",
                url: "http://localhost:8080/genes",
            })
            .then(function(genes) {
                GenesList.list = genes.map(function(item){
                    return [item]
                })
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
            $(vnode.dom).append('<table id="genesTable" class="display"></table>');  
        },
        onupdate: function(vnode){
            $('#genesTable').DataTable({
                data: GenesList.list,
                columns: [
                    {title:"REF"}
                ],
                columnDefs: [
                    {
                        targets:0,  //column to be applied at
                        render: function(data,type,row,meta){
                            return '<a href="#!/'+data+'">'+data+'</a>';
                        },
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