# -*- coding: utf-8 -*-
# from odoo import http


# class MPlayer(http.Controller):
#     @http.route('/m_player/m_player', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/m_player/m_player/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('m_player.listing', {
#             'root': '/m_player/m_player',
#             'objects': http.request.env['m_player.m_player'].search([]),
#         })

#     @http.route('/m_player/m_player/objects/<model("m_player.m_player"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('m_player.object', {
#             'object': obj
#         })
