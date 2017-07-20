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
                console.log(genes[0]),
                GenesList.headers = genes[0],
                GenesList.list = genes[1],
                console.log(GenesList.list[0])
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
            console.log(GenesList.list.ensembl_gene),
            $('#genesTable').DataTable({
                data: GenesList.list,
                columnDefs: [
                    {
                        targets: 0,
                        title:GenesList.headers[0],
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