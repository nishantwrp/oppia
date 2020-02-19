# coding: utf-8
#
# Copyright 2020 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""One-off jobs for customization arg validations"""

from __future__ import absolute_import  # pylint: disable=import-only-modules
from __future__ import unicode_literals  # pylint: disable=import-only-modules

from core import jobs
from core.domain import customization_args_util
from core.platform import models
from core.domain import interaction_registry

(
    exp_models, question_models) = (
        models.Registry.import_models([
            models.NAMES.exploration, models.NAMES.question]))

class ExplorationCustomizationArgsValidationOneOffJob(jobs.BaseMapReduceOneOffJobManager):
    @classmethod
    def entity_classes_to_map_over(cls):
        return [exp_models.ExplorationModel]

    @staticmethod
    def map(model):
        states = model.states
        for state_name, state in states.items():
            interaction = state['interaction']
            interaction_id = interaction['id']
            customization_args = interaction['customization_args']
            ca_specs = interaction_registry.Registry.get_interaction_by_id(interaction_id).customization_arg_specs
            try:
                customization_args_util.validate_customization_args_and_values('interaction', interaction_id, customization_args, ca_specs)
            except:
                yield('Invalid States', ('Exp Id: %s, State: %s') % (model.id, state_name))

    @staticmethod
    def reduce(key, values):
        """Implements the reduce function for this job."""

        yield (key, values)

class QuestionCustomizationArgsValidationOneOffJob(jobs.BaseMapReduceOneOffJobManager):
    @classmethod
    def entity_classes_to_map_over(cls):
        return [question_models.QuestionModel]

    @staticmethod
    def map(model):
        state = model.question_state_data
        interaction = state['interaction']
        interaction_id = interaction['id']
        customization_args = interaction['customization_args']
        ca_specs = interaction_registry.Registry.get_interaction_by_id(interaction_id).customization_arg_specs
        try:
            customization_args_util.validate_customization_args_and_values('interaction', interaction_id, customization_args, ca_specs)
        except:
            yield('Invalid Questions', ('Question Id: %s') % (model.id))

    @staticmethod
    def reduce(key, values):
        """Implements the reduce function for this job."""
        yield (key, values)
