import os
import cherrypy
import time
from pprint import pprint

global data_manager


class DataManager(object):

    def __init__(self, alignment_dirs):
        self._alignment_dirs = alignment_dirs
        self._build_gene_map()
        self._gene_list = sorted(list(self._gene_map))

    def get_gene_list(self):
        return self._gene_list

    def _build_gene_map(self):

        gene_map = {}

        for directory in self._alignment_dirs:
            for filename in os.listdir(directory):
                gene_name = self._filename_to_gene_name(filename)
                if gene_name not in gene_map:
                    gene_map[gene_name] = {
                        'files': []
                    }

                gene_map[gene_name]['files'].append(os.path.join(directory, filename))

        #pprint(gene_map)
        #print(len(gene_map))
        self._gene_map = gene_map

    def _filename_to_gene_name(self, filename):
        return filename[:filename.index('.')]


class Api(object):

    @cherrypy.expose
    def yolo(self):
        return "Hi there"

    @cherrypy.expose
    @cherrypy.tools.json_out()
    def genes(self):
        return data_manager.get_gene_list()

    @cherrypy.expose
    @cherrypy.tools.json_in()
    def reports(self):
        data = cherrypy.request.json
        return "report"

if __name__ == '__main__':

    MAMMARY_DIR = 'MammaryGenes'

    alignment_dirs = [
        os.path.join(MAMMARY_DIR, 'alignments'),
        os.path.join(MAMMARY_DIR, 'aln_cds'),
    ]
    data_manager = DataManager(alignment_dirs)

    static_dir = os.path.abspath(os.path.join(os.path.pardir, 'client'))
    conf = {
        '/': {
            'tools.staticdir.on': True,
            'tools.staticdir.dir': static_dir,
            'tools.staticdir.index': 'index.html'
        }
    }
    cherrypy.quickstart(Api(), '/', conf)
