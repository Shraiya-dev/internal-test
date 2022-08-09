const LimitedDiscoveryCTAMap = {
    RECEIVED: {
        actions: {
            view: true,
            edit: true,
            cancel: true,
            confirm: false,
            duplicate: false,
        },
    },
    CONFIRMED: {
        actions: {
            edit: true,
            view: true,
            cancel: true,
            startAllocation: false,
            duplicate: false,
        },
    },
    ALLOCATION_PENDING: {
        actions: {
            view: true,
            duplicate: false,
        },
    },
    ALLOCATION_IN_PROGRESS: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                },
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            edit: true,
            view: true,
            closeAllocation: true,
            jobCards: true,
            duplicate: false,
        },
    },
    ALLOCATION_CLOSED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                },
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            cancel: true,
            edit: true,
            view: true,
            jobCards: true,
            duplicate: false,
        },
    },
    DEPLOYED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                },
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            view: true,
            attendance: false,
            startProject: false,
            duplicate: false,
        },
    },
    CANCELLED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                },
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            view: true,
            attendance: false,
            startProject: false,
            duplicate: false,
        },
    },
}

const CTAMap = {
    RECEIVED: {
        actions: {
            view: true,
            edit: true,
            cancel: true,
            confirm: true,
            duplicate: true,
        },
    },
    CONFIRMED: {
        actions: {
            edit: true,
            view: true,
            cancel: true,
            startAllocation: true,
            duplicate: true,
        },
    },
    ALLOCATION_PENDING: {
        actions: {
            view: true,
            duplicate: true,
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
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    // cancel: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {
                    accept: true,
                },
            },
        },
        actions: {
            edit: true,
            view: true,
            jobCards: true,
            closeAllocation: true,
            duplicate: true,
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
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    // cancel: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {
                    accept: true,
                },
            },
        },
        actions: {
            cancel: true,
            edit: true,
            view: true,
            jobCards: true,
            deploy: true,
            duplicate: true,
        },
    },
    READY_TO_DEPLOY: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            READY_TO_DEPLOY: {
                filters: {
                    pdrc: true,
                    drc: true,
                },
                jobCardActions: {
                    cancel: true,
                    deploy: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },

        actions: {
            view: true,
            edit: true,
            jobCards: true,
            deploy: true,
            duplicate: true,
        },
    },
    DEPLOYED: {
        tabs: {
            WORKER_APPLIED: {
                jobCardActions: {
                    cancel: true,
                    accept: true,
                },
            },
            DEPLOYMENT_COMPLETE: {
                jobCardActions: {
                    manageEmployee: true,
                },
            },
            COMPLETED: {
                jobCardActions: {},
            },
            CANCELLED: {
                jobCardActions: {},
            },
        },
        actions: {
            view: true,
            attendance: true,
            startProject: false,
            duplicate: true,
            manageEmployees: true,
        },
    },
}

export const CTAMapByBookingType = {
    LIMITED_DISCOVERY: LimitedDiscoveryCTAMap,
    FPH: CTAMap,
}
