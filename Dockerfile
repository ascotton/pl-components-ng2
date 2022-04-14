ARG container_source=base
FROM 314904127601.dkr.ecr.us-west-2.amazonaws.com/pl-components-ng2/pl-components-ng2-${container_source}:trusty as builder

ARG FLAVOR

COPY --chown=root:root entrypoint.sh /usr/bin/entrypoint.sh
COPY --chown=www-data:www-data /nginx/apps.conf /etc/nginx/sites-enabled/apps.conf
COPY --chown=www-data:www-data /nginx/kubeapps.conf /etc/nginx/sites-enabled/kubeapps.conf
COPY --chown=www-data:www-data /nginx/apps_pl_components_ng2.conf /etc/nginx/apps.conf.d/apps_pl_components_ng2.conf
RUN chmod 700 /usr/bin/entrypoint.sh

RUN if [ "x$container_source" = "master" ] ; then mkdir -p /tmp/node_modules/; cp -rfpd /tmp/pl-components-ng2/node_modules/* /tmp/node_modules/.; fi

ADD --chown=www-data:www-data repo/plcomponentsng2.tar /tmp/pl-components-ng2/

ARG GITHUB_SSH_KEY=pl_aws_devops_user_deploy
ADD ${GITHUB_SSH_KEY} /root/.ssh/id_rsa

RUN cd /tmp/pl-components-ng2/ && if [ "x$container_source" = "master" ] ; then cp -rfpd /tmp/node_modules/* /tmp/pl-components-ng2/node_modules/.; fi && npm install && npm run env-stag && npm run build-stag

RUN rm -vf ${GITHUB_SSH_KEY} /root/.ssh/id*

FROM 314904127601.dkr.ecr.us-west-2.amazonaws.com/pl-components-ng2/pl-components-ng2-${container_source}:trusty as runtime

COPY --from=builder /tmp/pl-components-ng2/ /tmp/pl-components-ng2/
COPY --from=builder /etc/nginx/sites-enabled/ /etc/nginx/sites-enabled/
COPY --from=builder /usr/bin/entrypoint.sh /usr/bin/entrypoint.sh
COPY --from=builder /etc/nginx/apps.conf.d/ /etc/nginx/apps.conf.d/
COPY --from=builder --chown=www-data:www-data /tmp/pl-components-ng2/dist/ /var/www/pl-components-ng2/

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
