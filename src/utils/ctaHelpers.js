export const CTAMap = {
    RECEIVED: {
        actions: {
            view: true,
            edit: true,
            confirm: true,
        },
    },
    CONFIRMED: {
        actions: {
            view: true,
            startAllocation: true,
        },
    },
    ALLOCATION_PENDING: {
        actions: {
            view: true,
        },
    },
    ALLOCATION_IN_PROGRESS: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            ACCEPTED: {
                jobCardActions: {
                    cancel: true,
                    rtd: true,
                },
            },
            READY_TO_DEPLOY: {
                addWorker: true,
                jobCardActions: {
                    cancel: true,
                },
            },
        },
        actions: {
            view: true,
            jobCards: true,
            closeAllocation: true,
        },
    },
    ALLOCATION_CLOSED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            ACCEPTED: {
                jobCardActions: {
                    cancel: true,
                    rtd: true,
                },
            },
            READY_TO_DEPLOY: {
                addWorker: true,
                jobCardActions: {
                    cancel: true,
                },
            },
        },
        actions: {
            view: true,
            jobCards: true,
            rtd: true,
        },
    },
    READY_TO_DEPLOY: {
        tabs: {
            READY_TO_DEPLOY: {
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    cancel: true,
                },
            },
        },
        actions: {
            view: true,
            jobCards: true,
            deploy: true,
        },
    },
    DEPLOYED: {
        tabs: {
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    employmentComplete: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
        },
        actions: {
            view: true,
            attendance: true,
            startProject: true,
        },
    },
}
