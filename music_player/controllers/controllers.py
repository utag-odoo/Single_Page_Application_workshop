# -*- coding: utf-8 -*-
import json
from odoo import http
from odoo.http import Response
from odoo.modules.module import get_module_resource

class MusicPlayer(http.Controller):
    @http.route('/music', auth='public')
    def index(self, **kw):
        return http.request.render('music_player.music_template')

    @http.route('/music/search', auth='public', type="http", methods=["GET"])
    def search(self, **kw):
        # Retrieve the song name from the search query
        song_name = kw.get('song_name')
        # you will be facing you are not allowed to acces this model ---> add to manifest the csv file. remove group for now
        musics = http.request.env['music_player.music_player'].search_read([('name', 'ilike', song_name)],fields={"name", "url"})
        if not musics:
            musics = "Song not Found"

        return Response(json.dumps({'result': musics}), content_type='application/json')

    # A controller to play song from the audio

    @http.route('/music/<model("music_player.music_player"):music>', type='http', auth="public", methods=["GET"])
    def load(self, music, **kw):
        music_file_path = get_module_resource('music_player', 'static/songs', music.filename)
        file = open(music_file_path, 'rb').read()
        return file
